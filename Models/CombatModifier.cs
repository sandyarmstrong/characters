using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace characters.Models
{
    public struct CombatModifier
    {
        public CombatType CombatType { get; }

        public int DiceCount { get; }

        public int DiceSize { get; }

        public int Remainder { get; }

        public int FailPercentage { get; }

        public CombatModifier (
            CombatType combatType,
            int diceCount,
            int diceSize,
            int remainder,
            int failPercentage
        )
        {
            CombatType = combatType;
            DiceCount = diceCount;
            DiceSize = diceSize;
            Remainder = remainder;
            FailPercentage = failPercentage;
        }
    }
}