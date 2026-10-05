from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from uuid import UUID

from app.schemas.knowledge import EvidenceCard


@dataclass
class LLMResponse:
    """Response from an LLM provider."""
    text: str
    model: str
    usage: Optional[Dict[str, int]] = None
    finish_reason: Optional[str] = None


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""
    
    @abstractmethod
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.1,
        max_tokens: int = 1000,
    ) -> LLMResponse:
        """Generate a response from the LLM."""
        pass
    
    @abstractmethod
    async def health_check(self) -> bool:
        """Check if the LLM provider is available."""
        pass
    
    @property
    @abstractmethod
    def model_name(self) -> str:
        """Return the model name."""
        pass


class MockLLMProvider(LLMProvider):
    """Deterministic mock LLM provider for testing and development."""
    
    def __init__(self, response_map: Optional[Dict[str, str]] = None):
        self._response_map = response_map or {}
        self._call_count = 0
        self._last_prompt = ""
    
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.1,
        max_tokens: int = 1000,
    ) -> "LLMResponse":
        """Generate a deterministic mock response."""
        self._call_count += 1
        self._last_prompt = prompt
        
        # Check for exact prompt match in response map
        for key, response in self._response_map.items():
            if key in prompt:
                return LLMResponse(
                    text=response,
                    model="mock-llm",
                    usage={"prompt_tokens": len(prompt), "completion_tokens": len(response)},
                    finish_reason="stop",
                )
        
        # Default deterministic response based on prompt content
        if "abstain" in prompt.lower() or "no evidence" in prompt.lower():
            text = "I couldn't verify this from the approved sources, so I won't guess. Would you like to talk to a counsellor?"
        elif "distress" in prompt.lower():
            text = "I'm concerned about what you shared. I'm connecting you with a person who can help, and here is a helpline you can contact now."
        elif "evidence" in prompt.lower() or "record" in prompt.lower():
            # Generate a response that cites records
            text = "Based on the verified evidence: The placement rate for ITI Electrician graduates in Maharashtra is 72% within 6 months [rec:1]. This is a state-level figure; district-level data unavailable."
        else:
            text = "Based on the verified evidence provided, I can share the following information. Please consult the evidence cards for details."
        
        return LLMResponse(
            text=text,
            model="mock-llm",
            usage={"prompt_tokens": len(prompt), "completion_tokens": len(text)},
            finish_reason="stop",
        )
    
    async def health_check(self) -> bool:
        """Mock health check always returns True."""
        return True
    
    @property
    def model_name(self) -> str:
        return "mock-llm"
    
    def set_response(self, key: str, response: str):
        """Set a custom response for a specific prompt key."""
        self._response_map[key] = response
    
    def get_call_count(self) -> int:
        return self._call_count
    
    def get_last_prompt(self) -> str:
        return self._last_prompt


class OpenAIProvider(LLMProvider):
    """OpenAI provider - requires OPENAI_API_KEY environment variable."""
    
    def __init__(self, api_key: str, model: str = "gpt-4o-mini"):
        self._api_key = api_key
        self._model = model
        self._client = None
    
    def _get_client(self):
        if self._client is None:
            try:
                import openai
                self._client = openai.AsyncOpenAI(api_key=self._api_key)
            except ImportError:
                raise RuntimeError("openai package not installed. Run: pip install openai")
        return self._client
    
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.1,
        max_tokens: int = 1000,
    ) -> "LLMResponse":
        client = self._get_client()
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        response = await client.chat.completions.create(
            model=self._model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        
        return LLMResponse(
            text=response.choices[0].message.content or "",
            model=self._model,
            usage={
                "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
                "completion_tokens": response.usage.completion_tokens if response.usage else 0,
            },
            finish_reason=response.choices[0].finish_reason,
        )
    
    async def health_check(self) -> bool:
        try:
            client = self._get_client()
            await client.models.list()
            return True
        except Exception:
            return False
    
    @property
    def model_name(self) -> str:
        return self._model


def create_llm_provider(provider: str = "mock", **kwargs) -> LLMProvider:
    """Factory function to create LLM provider."""
    if provider == "mock":
        return MockLLMProvider(**kwargs)
    elif provider == "openai":
        return OpenAIProvider(**kwargs)
    else:
        raise ValueError(f"Unknown LLM provider: {provider}")