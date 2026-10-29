# FairShare(TM) Anti-Monopolization Mathematical Specification

## 1. Objective
To prevent well-funded research teams from monopolizing high-value capital equipment (e.g. Scanning Electron Microscopes and 5-Axis CNC Mills) while providing transparent, explainable allocation for all institutional members.

## 2. Mathematical Model

For any user $u$ requesting resource $r$ at time $t$:

$$\text{AllocationScore}(u, r, t) = S_{\text{reputation}}(u) - P_{\text{concurrent}}(u) - W_{\text{resource}}(r) - P_{\text{cooldown}}(u, r, t) + B_{\text{cross-silo}}(u, r)$$

Where:
- $S_{\text{reputation}}(u) \in [0, 100]$: User base reputation (starts at 100).
- $P_{\text{concurrent}}(u) = 25$ if active reservations $\ge 2$, else $0$.
- $W_{\text{resource}}(r)$: Resource weighting factor ($10$ for Laser Cutter, $15$ for CNC Mill, $25$ for SEM).
- $P_{\text{cooldown}}(u, r, t) = 20$ if $(t - t_{\text{last}}) < T_{\text{cooldown}}(r)$, else $0$.
- $B_{\text{cross-silo}}(u, r) = 10$ if $\text{Dept}(u) \neq \text{Dept}(r)$ (Interdisciplinary bonus).

## 3. Tier Classification
- **Score $\ge 85$ & Cooldown Inactive:** High Priority (Immediate approval recommendation).
- **Cooldown Active:** Cool-off Queued (Transfers priority to other researchers).
- **Score $< 40$:** Quota Exceeded (Requires faculty advisor appeal).
