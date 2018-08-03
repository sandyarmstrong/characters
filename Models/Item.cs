using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace characters.Models
{
    // TODO: Items and relevant slots (think amulets, which can only be
    //       worn one at a time)
    public class Item
    {
        public string Id { get; }

        public virtual ItemType Type { get; }

        public string Name { get; }

        public IReadOnlyList<Buff> Modifiers { get; }

        public Item (
            string id,
            ItemType type,
            string name = null,
            IReadOnlyList<Buff> modifiers = null)
        {
            Id = id ?? Guid.NewGuid ().ToString ();
            Type = type;
            Name = name;
            Modifiers = modifiers?.ToArray () ?? Array.Empty<Buff> ();
        }

        public static Item Create (
            ItemType type,
            string name = null,
            IReadOnlyList<Buff> modifiers = null)
            => new Item (
                null,
                type,
                name,
                modifiers);

        public static Item CreateShield (
            int defense,
            string name = null,
            IReadOnlyList<Buff> modifiers = null)
            => Create (
                ItemType.Shield,
                name,
                new [] {
                    new Buff (BuffType.MeleeDefense, defense),
                    new Buff (BuffType.RangedDefense, defense),
                    new Buff (BuffType.SpellDefense, defense),
                }.Concat (modifiers ?? Array.Empty<Buff> ()).ToArray ());

        public static Item CreateArmor (
            int defense,
            string name = null,
            IReadOnlyList<Buff> modifiers = null)
            => Create (
                ItemType.Armor,
                name,
                new [] {
                    new Buff (BuffType.MeleeDefense, defense),
                    new Buff (BuffType.RangedDefense, defense),
                    new Buff (BuffType.SpellDefense, defense),
                }.Concat (modifiers ?? Array.Empty<Buff> ()).ToArray ());
    }
}