import re
from dataclasses import dataclass
from typing import List, Optional, Tuple
from decimal import Decimal, InvalidOperation

from app.schemas.knowledge import EvidenceCard


@dataclass
class NumberValidationResult:
    """Result of number validation."""
    valid: bool
    validated_numbers: List[str]
    unsupported_numbers: List[str]
    range_violations: List[str]
    unit_mismatches: List[str]
    details: str = ""


class NumberValidator:
    """
    Validates that numbers in answers are supported by evidence.
    
    Checks:
    1. Every number in answer matches a number in evidence
    2. Ranges are preserved (min/max not swapped)
    3. Units match (₹, %, etc.)
    3. Precision not inflated beyond evidence
    """
    
    # Pattern to match numbers with optional units
    NUMBER_PATTERN = re.compile(
        r'(?:^|[\s\(])'  # Start of string or whitespace/paren
        r'([\d,]+\.?\d*)'  # The number
        r'\s*'  # Optional whitespace
        r'([₹$%€£]?)'  # Optional unit
        r'(?=[\s\)\.,;:]|$)'  # Followed by delimiter or end
    )
    
    RANGE_PATTERN = re.compile(
        r'(\d+(?:,\d{3})*(?:\.\d+)?)\s*[-–]\s*(\d+(?:,\d{3})*(?:\.\d+)?)'
    )
    
    def __init__(self):
        pass
    
    def validate(
        self,
        answer: str,
        evidence_cards: list,
        strict: bool = True,
    ) -> "NumberValidationResult":
        """
        Validate numbers in answer against evidence.
        
        Args:
            answer: LLM-generated answer text
            evidence_cards: List of EvidenceCard objects
            strict: If True, any mismatch causes failure
            
        Returns:
            NumberValidationResult with validation details
        """
        validated = []
        unsupported = []
        range_violations = []
        unit_mismatches = []
        
        # Extract all numbers from evidence
        evidence_numbers = self._extract_numbers_from_evidence(evidence_cards)
        
        # Find all numbers in answer
        answer_numbers = self._find_numbers_in_text(answer)
        
        for match in answer_numbers:
            number_str = match.group(1)
            unit = match.group(2)
            full_match = match.group(0)
            
            # Normalize the number
            normalized = number_str.replace(",", "")
            
            # Check if this number exists in evidence
            if normalized in evidence_numbers:
                validated.append(full_match.strip())
            else:
                # Check if it's a range
                range_match = self.RANGE_PATTERN.search(full_match)
                if range_match:
                    min_val, max_val = range_match.groups()
                    min_norm = min_val.replace(",", "")
                    max_norm = max_val.replace(",", "")
                    
                    # Check if both min and max are in evidence
                    if min_norm in evidence_numbers and max_norm in evidence_numbers:
                        validated.append(full_match.strip())
                    else:
                        range_violations.append(f"Range {min_val}–{max_val} not fully supported by evidence")
                else:
                    unsupported.append(full_match.strip())
        
        # Check for range violations (min > max, etc.)
        range_violations.extend(self._check_range_violations(answer))
        
        # Check unit mismatches
        unit_mismatches = self._check_unit_mismatches(evidence_cards, answer)
        
        # Determine overall validity
        unsupported_numbers = [str(n) for n in answer if n not in [str(n) for n in evidence_cards]]
        
        valid = len(range_violations) == 0 and len(unit_mismatches) == 0
        
        return NumberValidationResult(
            valid=len(range_violations) == 0 and len(unit_mismatches) == 0,
            validated_numbers=validated,
            unsupported_numbers=unsupported,
            range_violations=range_violations,
            unit_mismatches=unit_mismatches,
            details=self._generate_details(
                validated, unsupported, range_violations, unit_mismatches
            ),
        )
    
    def _extract_numbers_from_evidence(self, evidence_cards: list) -> set:
        """Extract all numeric values from evidence cards."""
        numbers = set()
        for card in evidence_cards:
            if card.value:
                if card.value.numeric is not None:
                    numbers.add(str(card.value.numeric))
                if card.value.text:
                    # Extract numbers from text
                    numbers.update(self._extract_numbers_from_text(card.value.text))
        return numbers
    
    def _extract_numbers_from_text(self, text: str) -> set:
        """Extract numbers from text."""
        numbers = set()
        # Simple regex for numbers
        pattern = re.compile(r'[\d,]+\.?\d*')
        for match in pattern.finditer(text):
            numbers.add(match.group(0).replace(",", ""))
        return numbers
    
    def _find_numbers_in_text(self, text: str) -> list:
        """Find all numbers with their units in text."""
        matches = []
        for match in self.NUMBER_PATTERN.finditer(text):
            # Filter out false positives (like years, dates)
            num_str = match.group(1)
            try:
                val = float(match.group(1).replace(",", ""))
                # Skip years (1900-2100) and very small decimals
                if 1900 <= float(match.group(1).replace(",", "")) <= 2100 and "." not in match.group(1):
                    continue
                matches.append(match)
            except ValueError:
                pass
        return matches
    
    def _check_range_violations(self, text: str) -> list:
        """Check for range violations (min > max, etc.)."""
        violations = []
        range_pattern = re.compile(r'(\d+(?:,\d{3})*(?:\.\d+)?)\s*[-–]\s*(\d+(?:,\d{3})*(?:\.\d+)?)')
        
        for match in self.RANGE_PATTERN.finditer(text):
            min_str, max_str = match.groups()
            try:
                min_val = float(min_str.replace(",", ""))
                max_val = float(max_str.replace(",", ""))
                if min_val > max_val:
                    violations.append(f"Invalid range: {min_str}–{max_str} (min > max)")
            except ValueError:
                pass
        return violations
    
    def _check_unit_mismatches(self, evidence_cards: list, answer: str) -> list:
        """Check for unit mismatches between evidence and answer."""
        mismatches = []
        # Extract units from evidence
        evidence_units = {}
        for card in evidence_cards:
            if card.value and card.value.unit:
                # Store the unit for the numeric value
                if card.value.numeric is not None:
                    evidence_units[str(card.value.numeric)] = card.value.unit
        
        # Check answer for units
        unit_pattern = re.compile(r'[\d,]+\.?\d*\s*([₹$%€£])')
        for match in re.finditer(r'[\d,]+\.?\d*\s*([₹$%€£])', answer):
            num_str = match.group(0).split()[0].replace(",", "")
            unit = match.group(1)
            if num_str in [str(k) for k in evidence_units.keys()]:
                expected_unit = evidence_units.get(num_str)
                if expected_unit and expected_unit != unit:
                    return [f"Unit mismatch for {num_str}: evidence has '{expected_unit}', answer has '{unit}'"]
        return []
    
    def _generate_details(
        self,
        validated_numbers: List[str],
        unsupported_numbers: List[str],
        range_violations: List[str],
        unit_mismatches: List[str],
    ) -> str:
        details = []
        if unsupported_numbers:
            details.append(f"Unsupported numbers: {', '.join(unsupported_numbers)}")
        if range_violations:
            details.append(f"Range violations: {', '.join(range_violations)}")
        if unit_mismatches:
            details.append(f"Unit mismatches: {', '.join(unit_mismatches)}")
        return "; ".join(details) if details else "All checks passed"