using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace characters.Models
{
    public struct Buff
    {
        public BuffType Type { get; }

        public int Modifier { get; }

        public Buff (BuffType type, int modifier)
        {
            Type = type;
            Modifier = modifier;
        }
    }
}