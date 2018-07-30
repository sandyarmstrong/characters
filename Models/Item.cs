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
        public ItemType Type { get; }

        public string Name { get; }

        public IReadOnlyList<Buff> Modifiers { get; }

        public Item (
            ItemType type,
            string name = null,
            IReadOnlyList<Buff> modifiers = null)
        {
            Type = type;
            Name = name;
            Modifiers = modifiers?.ToArray ();
        }

        public static Item CreateShield (
            int defense,
            string name = null,
            IReadOnlyList<Buff> modifiers = null)
            => new Item (
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
            => new Item (
                ItemType.Armor,
                name,
                new [] {
                    new Buff (BuffType.MeleeDefense, defense),
                    new Buff (BuffType.RangedDefense, defense),
                    new Buff (BuffType.SpellDefense, defense),
                }.Concat (modifiers ?? Array.Empty<Buff> ()).ToArray ());
    }
}