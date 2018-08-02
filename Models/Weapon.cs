using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace characters.Models
{
    public class Weapon
    {
        public string Id { get; }

        public string Name { get; }

        public CombatType Type { get; }

        public Buff? Buff { get; }

        public Weapon (
            string id,
            string name,
            CombatType type,
            Buff? buff = null)
        {
            Id = id ?? Guid.NewGuid ().ToString ();
            Name = name ?? throw new ArgumentNullException (nameof (name));
            Type = type;
            Buff = buff;
        }

        public static Weapon Create (
            string name,
            CombatType type,
            Buff? buff = null)
            => new Weapon (
                null,
                name,
                type,
                buff);

        public static readonly Weapon Fists = Create (
            "Fists",
            CombatType.Melee);

        public static readonly Weapon Mind = Create (
            "Mind",
            CombatType.Spell);
    }
}