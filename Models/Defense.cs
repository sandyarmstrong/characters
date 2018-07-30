using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace characters.Models
{
    public struct Defense
    {
        public CombatType Type { get; }

        public int Modifier { get; }

        public Defense (CombatType type, int modifier)
        {
            Type = type;
            Modifier = modifier;
        }
    }
}