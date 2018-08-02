using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using characters.Models;

namespace characters.Controllers
{
    [Route("api/[controller]/[action]")]
    public class StashController : Controller
    {
        // TODO: Real DB please (or, screw that, just persist to json)
        // TODO: Do we want ids and stuff for weapons/items?
        static readonly Dictionary<string, Item> ItemDatabase =
            new Dictionary<string, Item> ();
        static readonly Dictionary<string, Weapon> WeaponDatabase =
            new Dictionary<string, Weapon> ();

        public class Stash
        {
            public IReadOnlyList<Item> Items { get; }

            public IReadOnlyList<Weapon> Weapons { get; }

            public Stash (
                IReadOnlyList<Item> items,
                IReadOnlyList<Weapon> weapons)
            {
                Items = items
                    ?? throw new ArgumentNullException (nameof (items));
                Weapons = weapons
                    ?? throw new ArgumentNullException (nameof (weapons));
            }
        }

        static StashController ()
        {
            ResetDatabase ();
        }
        
        static void ResetDatabase ()
        {
            ItemDatabase.Clear ();
            WeaponDatabase.Clear ();

            var item = Item.Create (
                ItemType.Ring,
                "The One Ring",
                new [] {
                    new Buff (BuffType.Health, 100),
                });
            ItemDatabase [item.Id] = item;

            var weapons = new [] {
                Weapon.Create (
                    "Excalibur",
                    CombatType.Melee,
                    new Buff (BuffType.Strength, 5)),
                Weapon.Create (
                    "Blunt Spoon",
                    CombatType.Melee),
            };
            foreach (var weapon in weapons)
                WeaponDatabase [weapon.Id] = weapon;
        }

        [HttpGet]
        public Stash All ()
        {
            return new Stash (
                ItemDatabase.Values.ToArray (),
                WeaponDatabase.Values.ToArray ());
        }

        [HttpPost]
        public Stash Reset ()
        {
            ResetDatabase ();
            return All ();
        }

        // TODO: Give stuff to characters

        [HttpPost]
        public Stash CreateWeapon (
            [FromBody] Weapon weapon)
        {
            if (weapon.Id == null)
                weapon = new Weapon (null, weapon.Name, weapon.Type, weapon.Buff);
            WeaponDatabase [weapon.Id] = weapon;
            return All ();
        }

        [HttpPost]
        public Stash CreateItem (
            [FromBody] Item item)
        {
            if (item.Id == null)
                item = new Item (null, item.Type, item.Name, item.Modifiers);
            ItemDatabase [item.Id] = item;
            return All ();
        }
    }
}