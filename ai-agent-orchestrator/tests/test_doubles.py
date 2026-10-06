"""
Test Doubles for Isolated Unit Testing.
Strictly isolated within the test suite as specified in Phase 14 & Phase 17.
Production API routes use real SQLAlchemy database dependencies (Depends(get_db)).
"""
import uuid
from typing import Dict, Any, List, Optional
from src.models.entities import (
    Application,
    Document,
    EvidenceRecord,
    HumanDecision,
    AuditLedgerEntry,
)

class MockQuery:
    def __init__(self, items: List[Any]):
        self._items = list(items)

    def filter(self, *criteria):
        filtered = []
        for item in self._items:
            matches = True
            for criterion in criteria:
                # Handle SQLAlchemy BinaryExpression
                if hasattr(criterion, "left") and hasattr(criterion, "right"):
                    col = getattr(criterion.left, "key", None) or getattr(criterion.left, "name", None)
                    # If left is a function call like func.lower(...) or func.upper(...)
                    if not col and hasattr(criterion.left, "element"):
                        col = getattr(criterion.left.element, "key", None) or getattr(criterion.left.element, "name", None)

                    val = getattr(criterion.right, "value", None)
                    if val is None and hasattr(criterion.right, "element"):
                        val = getattr(criterion.right.element, "value", None)
                    if criterion.right.__class__.__name__ == "True_":
                        val = True
                    elif criterion.right.__class__.__name__ == "False_":
                        val = False

                    if col and hasattr(item, col):
                        item_val = getattr(item, col)
                        # Case-insensitive string match or exact match
                        if isinstance(item_val, str) and isinstance(val, str):
                            if item_val.lower() != val.lower():
                                matches = False
                        elif isinstance(item_val, bool) or isinstance(val, bool):
                            if bool(item_val) != bool(val):
                                matches = False
                        elif str(item_val) != str(val) and item_val != val:
                            matches = False
            if matches:
                filtered.append(item)
        return MockQuery(filtered)

    def order_by(self, *args):
        if not args or not self._items:
            return self
        arg = args[0]
        descending = False
        col = None
        if hasattr(arg, "modifier"):
            mod = getattr(arg, "modifier", None)
            if mod is not None and getattr(mod, "__name__", "") == "desc_op":
                descending = True
            if hasattr(arg, "element"):
                col = getattr(arg.element, "key", None) or getattr(arg.element, "name", None)
        else:
            col = getattr(arg, "key", None) or getattr(arg, "name", None)
            if hasattr(arg, "element"):
                col = getattr(arg.element, "key", None) or getattr(arg.element, "name", None)

        if col:
            sorted_items = sorted(
                self._items,
                key=lambda x: (getattr(x, col, None) is None, getattr(x, col, None)),
                reverse=descending
            )
            return MockQuery(sorted_items)
        return self

    def offset(self, n: int):
        return MockQuery(self._items[n:])

    def limit(self, n: int):
        return MockQuery(self._items[:n])

    def first(self):
        return self._items[0] if self._items else None

    def all(self):
        return list(self._items)

    def count(self):
        return len(self._items)

    def update(self, values: Dict[str, Any]):
        for item in self._items:
            for k, v in values.items():
                if hasattr(item, k):
                    setattr(item, k, v)
        return len(self._items)


class TestDBSessionDouble:
    """
    Isolated Mock DB Session Double for Unit Tests.
    Simulates SQLAlchemy Session without requiring an active PostgreSQL daemon.
    """
    __test__ = False

    def __init__(self):
        self.applications: List[Application] = []
        self.documents: List[Document] = []
        self.evidence: List[EvidenceRecord] = []
        self.decisions: List[HumanDecision] = []
        self.audit_entries: List[AuditLedgerEntry] = []

    def add(self, instance: Any):
        if isinstance(instance, Application) and instance not in self.applications:
            self.applications.append(instance)
        elif isinstance(instance, Document) and instance not in self.documents:
            self.documents.append(instance)
        elif isinstance(instance, EvidenceRecord) and instance not in self.evidence:
            self.evidence.append(instance)
        elif isinstance(instance, HumanDecision) and instance not in self.decisions:
            self.decisions.append(instance)
        elif isinstance(instance, AuditLedgerEntry) and instance not in self.audit_entries:
            self.audit_entries.append(instance)

    def commit(self):
        pass

    def rollback(self):
        pass

    def refresh(self, instance: Any):
        pass

    def query(self, entity_class: Any) -> MockQuery:
        if entity_class == Application:
            return MockQuery(self.applications)
        elif entity_class == Document:
            return MockQuery(self.documents)
        elif entity_class == EvidenceRecord:
            return MockQuery(self.evidence)
        elif entity_class == HumanDecision:
            return MockQuery(self.decisions)
        elif entity_class == AuditLedgerEntry:
            return MockQuery(self.audit_entries)
        return MockQuery([])

    def close(self):
        pass
