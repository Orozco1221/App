# /xp-audit — Auditoría de coherencia del sistema de XP y gamificación

Revisa toda la lógica de puntos XP en el codebase y detecta inconsistencias.

## Qué hacer al ejecutar este comando

1. Localizar todos los puntos donde se asignan o calculan XP:
   - `src/constants.ts` → `DEFAULT_ITEM_POINTS`, `RANKING_TIERS`
   - `src/hooks/useChallenge.ts` → puntos por completar retos
   - `src/hooks/useRanking.ts` → cálculo del ranking y tiers
   - Cualquier otro archivo que mencione "points", "xp", "puntos"

2. Verificar coherencia entre:
   - Los tiers definidos en `RANKING_TIERS` y los mensajes mostrados al usuario
   - Los puntos asignados por cada acción y si son proporcionales al esfuerzo
   - Que todas las features que deberían dar puntos realmente los dan
   - Que no hay doble-conteo o features que den puntos sin que el ranking se actualice

3. Revisar el flujo completo de un usuario que gana puntos:
   - ¿Cómo se guardan los puntos? (Supabase o estado local)
   - ¿Se persisten entre sesiones?
   - ¿El ranking se recalcula correctamente?

4. Producir el informe:
   ```
   AUDIT DE SISTEMA XP — Randstad AI Hub
   =======================================
   
   📊 RESUMEN DEL SISTEMA:
   - Tiers: [lista con puntos mínimos]
   - Fuentes de XP: [lista de acciones que dan puntos y cuántos]
   - Persistencia: [cómo y dónde se guardan]
   
   ✅ COHERENTE:
   - [Lista de cosas que funcionan bien]
   
   ⚠️ INCONSISTENCIAS DETECTADAS:
   - [Descripción del problema y dónde está]
   
   💡 SUGERENCIAS:
   - [Ideas para mejorar el equilibrio del sistema de gamificación]
   ```
