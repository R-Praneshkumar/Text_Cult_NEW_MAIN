## 2026-01-03 - FlatList Optimization
**Learning:** `FlatList` optimization (extracting `renderItem`, `keyExtractor`, and `memo`izing items) is a standard pattern that should be applied even if the current dataset is small, as it prevents future performance regressions.
**Action:** When optimizing lists, always check for anonymous functions passed to `renderItem` and extract them. Ensure no unused imports are left behind (e.g. `useCallback` when moving functions outside component).
