using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace characters.Models
{
    public class Weapon
    {
        public string Name { get; }

        public CombatType Type { get; }

        public Buff? Buff { get; }

        public Weapon (
            string name,
            CombatType type,
            Buff? buff = null
        )
        {
            Name = name ?? throw new ArgumentNullException (nameof (name));
            Type = type;
            Buff = buff;
        }

        public static readonly Weapon Fists = new Weapon (
            "Fists",
            CombatType.Melee);

        public static readonly Weapon Mind = new Weapon (
            "Mind",
            CombatType.Spell);
    }
}