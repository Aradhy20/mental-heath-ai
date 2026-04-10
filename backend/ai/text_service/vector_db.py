"""Vector DB loader for the text service.

This module chooses the best available vector DB implementation.
"""

try:
    from .vector_db_enhanced import vector_db
except Exception:
    from .vector_db_mock import vector_db

__all__ = ["vector_db"]
