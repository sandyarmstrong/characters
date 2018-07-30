using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace characters.Models
{
    public class Attack
    {
        public string Name { get; }

        public CombatModifier CombatModifier { get; }

        public Attack (string name, CombatModifier combatModifier)
        {
            Name = name ?? throw new ArgumentNullException (nameof (name));
            CombatModifier = combatModifier;
        }
    }
}