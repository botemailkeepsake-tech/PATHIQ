import re
from dataclasses import dataclass
from typing import List, Optional, Set
from uuid import UUID

from app.schemas.knowledge import EvidenceCard


@dataclass
class ValidationResult:
    """Result of grounding validation."""
    valid: bool
    unsupported_claims: List[str]
    unsupported_numbers: List[str]
    missing_citations: List[str]
    forbidden_promises: List[str]
    details: str = ""


class GroundingValidator:
    """
    Validates that LLM-generated answers are grounded in the provided evidence.
    
    Checks:
    1. Every [rec:ID] citation exists in the retrieved evidence
    2. Every numeric value in the answer appears in cited evidence
    3. No factual claims without citations
    4. No forbidden promises (guarantees, 100%, etc.)
    """
    
    # Patterns for detecting claims that need citations
    CITATION_PATTERN = re.compile(r'\[rec:([^\]]+)\]')
    
    # Patterns for numbers that need validation
    # Use lookahead/lookbehind to properly handle word boundaries around %/$/₹
    NUMBER_PATTERN = re.compile(r'(?<!\w)[\d,]+\.?\d*\s*[%$](?=\W|$)')
    
    # Forbidden promise patterns
    FORBIDDEN_PATTERNS = [
        re.compile(r'\bguarantee\b', re.IGNORECASE),
        re.compile(r'\bwill definitely\b', re.IGNORECASE),
        re.compile(r'\b100%\b'),
        re.compile(r'\bcertainly\b', re.IGNORECASE),
        re.compile(r'\babsolutely\b', re.IGNORECASE),
        re.compile(r'\bdefinitely\b', re.IGNORECASE),
        re.compile(r'\bpromise\b', re.IGNORECASE),
        re.compile(r'\bwill get\b', re.IGNORECASE),
        re.compile(r'\bmust get\b', re.IGNORECASE),
    ]
    
    # Claim-indicating patterns (heuristic)
    CLAIM_PATTERNS = [
        re.compile(r'\beligible\b', re.IGNORECASE),
        re.compile(r'\bcan\b', re.IGNORECASE),
        re.compile(r'\brule\b', re.IGNORECASE),
        re.compile(r'\bscheme\b', re.IGNORECASE),
        re.compile(r'\badmission\b', re.IGNORECASE),
        re.compile(r'\bplacement\b', re.IGNORECASE),
        re.compile(r'\bsalary\b', re.IGNORECASE),
        re.compile(r'\bincome\b', re.IGNORECASE),
    ]

    def __init__(self):
        pass

    def validate(
        self,
        answer: str,
        evidence_cards: list,
    ) -> "ValidationResult":
        """
        Validate that the answer is grounded in the provided evidence.
        
        Args:
            answer: The LLM-generated answer text
            evidence_cards: List of EvidenceCard objects
            
        Returns:
            ValidationResult with validation details
        """
        unsupported_claims = []
        unsupported_numbers = []
        missing_citations = []
        forbidden_promises = []
        
        # Get set of valid record IDs from evidence
        valid_record_ids = set()
        for card in evidence_cards:
            try:
                valid_record_ids.add(str(card.record_id))
            except (AttributeError, TypeError):
                pass
        
        # 1. Check citations
        citation_result = self._validate_citations(answer, valid_record_ids)
        missing_citations.extend(citation_result["missing"])
        
        # 2. Check numeric values
        number_result = self._validate_numbers(answer, evidence_cards)
        unsupported_numbers.extend(number_result["unsupported"])
        
        # 3. Check for unsupported factual claims
        claim_result = self._validate_claims(answer, evidence_cards)
        unsupported_claims.extend(claim_result["unsupported"])
        
        # 4. Check for forbidden promises
        forbidden_result = self._check_forbidden_promises(answer)
        forbidden_promises.extend(forbidden_result)
        
        # Determine overall validity
        has_errors = (
            len(missing_citations) > 0
            or len(unsupported_numbers) > 0
            or len(unsupported_claims) > 0
            or len(forbidden_promises) > 0
        )
        
        return ValidationResult(
            valid=not has_errors,
            unsupported_claims=unsupported_claims,
            unsupported_numbers=unsupported_numbers,
            missing_citations=missing_citations,
            forbidden_promises=forbidden_promises,
            details=self._generate_details(
                missing_citations, unsupported_numbers, 
                unsupported_claims, forbidden_promises
            ),
        )
    
    def _validate_citations(self, answer: str, valid_record_ids: Set[str]) -> dict:
        """Validate that all citations refer to valid record IDs."""
        citations = self.CITATION_PATTERN.findall(answer)
        missing = []
        for citation in citations:
            if citation not in valid_record_ids:
                missing.append(f"[rec:{citation}]")
        return {"missing": missing}
    
    def _validate_numbers(self, answer: str, evidence_cards: list) -> dict:
        """Validate that all numbers in answer are supported by evidence."""
        unsupported = []
        
        # Extract all numbers from answer
        numbers_in_answer = self.NUMBER_PATTERN.findall(answer)
        
        # Find all citation positions in the answer
        citation_positions = []
        for match in self.CITATION_PATTERN.finditer(answer):
            citation_positions.append((match.start(), match.end()))
        
        # Filter out UUIDs from numbers_in_answer and numbers within citations
        filtered_numbers = []
        for num in numbers_in_answer:
            # Skip if it looks like a UUID part (hex with dashes)
            if re.match(r'^[a-f0-9]{8,}$', num.replace("-", "")):
                continue
            # Skip if this number is part of a citation
            # Find the position of this number in the answer
            num_pos = answer.find(num)
            if num_pos >= 0:
                # Check if this number is within a citation
                in_citation = False
                for start, end in citation_positions:
                    if start <= num_pos < end:
                        in_citation = True
                        break
                if in_citation:
                    continue
            filtered_numbers.append(num)
        
        # Extract all numbers from evidence
        evidence_numbers = set()
        for card in evidence_cards:
            if card.value and card.value.numeric is not None:
                evidence_numbers.add(str(card.value.numeric))
            # Also check value text for numbers
            if card.value and hasattr(card.value, 'text') and card.value.text:
                try:
                    for num_match in self.NUMBER_PATTERN.findall(card.value.text):
                        evidence_numbers.add(num_match)
                except (TypeError, AttributeError):
                    pass
        
        for num in filtered_numbers:
            # Normalize the number (remove commas, etc.)
            normalized = num.replace(",", "").strip()
            if normalized and normalized not in evidence_numbers:
                unsupported.append(f"Number '{num}' not found in evidence")
        
        return {"unsupported": unsupported}
    
    def _validate_claims(self, answer: str, evidence_cards: list) -> dict:
        """Check for factual claims without citations."""
        unsupported = []
        
        # Split into sentences
        sentences = re.split(r'[.!?]+', answer)
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            # Check if sentence contains claim indicators
            has_claim = any(pattern.search(sentence) for pattern in self.CLAIM_PATTERNS)
            has_citation = bool(self.CITATION_PATTERN.search(sentence))
            has_number = bool(self.NUMBER_PATTERN.search(sentence))
            
            # If sentence makes a factual claim but has no citation or number
            if has_claim and not has_citation and not has_number:
                unsupported.append(sentence.strip())
        
        return {"unsupported": unsupported}
    
    def _check_forbidden_promises(self, answer: str) -> list:
        """Check for forbidden promises in the answer."""
        forbidden = []
        for pattern in self.FORBIDDEN_PATTERNS:
            if pattern.search(answer):
                match = pattern.search(answer)
                forbidden.append(f"Forbidden phrase: '{match.group()}'")
        return forbidden
    
    def _generate_details(
        self,
        missing_citations: List[str],
        unsupported_numbers: List[str],
        unsupported_claims: List[str],
        forbidden_promises: List[str],
    ) -> str:
        """Generate human-readable validation details."""
        details = []
        if missing_citations:
            details.append(f"Missing citations: {', '.join(missing_citations)}")
        if unsupported_numbers:
            details.append(f"Unsupported numbers: {', '.join(unsupported_numbers)}")
        if unsupported_claims:
            details.append(f"Unsupported claims: {'; '.join(unsupported_claims[:3])}")
        if forbidden_promises:
            details.append(f"Forbidden promises: {', '.join(forbidden_promises)}")
        return "; ".join(details) if details else "All checks passed"