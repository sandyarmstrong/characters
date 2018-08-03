using System;
using System.Collections.Generic;

namespace characters.Models
{
    public class Weapon : Item
    {
        public CombatType CombatType { get; }

        public override ItemType Type => ItemType.Weapon;

        public Weapon (
            string id,
            string name,
            CombatType combatType,
            IReadOnlyList<Buff> modifiers = null) :
            base (id, ItemType.Weapon, name, modifiers)
        {
            if (name == null)
                throw new ArgumentNullException (nameof (name));
            CombatType = combatType;
        }

        public static Weapon Create (
            string name,
            CombatType combatType,
            IReadOnlyList<Buff> modifiers = null)
            => new Weapon (
                null,
                name,
                combatType,
                modifiers);

        public static readonly Weapon Fists = Create (
            "Fists",
            CombatType.Melee);

        public static readonly Weapon Mind = Create (
            "Mind",
            CombatType.Spell);
    }
}