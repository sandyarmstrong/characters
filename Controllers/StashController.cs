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

        static StashController ()
        {
            ResetDatabase ();
        }
        
        static void ResetDatabase ()
        {
            ItemDatabase.Clear ();

            var items = new [] {
                Item.Create (
                    ItemType.Ring,
                    "The One Ring",
                    new [] {
                        new Buff (BuffType.Health, 100),
                    }),
                Weapon.Create (
                    "Excalibur",
                    CombatType.Melee,
                    new [] {
                        new Buff (BuffType.Strength, 5),
                    }),
                Weapon.Create (
                    "Blunt Spoon",
                    CombatType.Melee),
            };

            foreach (var item in items)
                ItemDatabase [item.Id] = item;
        }

        [HttpGet]
        public IReadOnlyList<Item> All ()
        {
            return ItemDatabase.Values.ToArray ();
        }

        [HttpPost]
        public IReadOnlyList<Item> Reset ()
        {
            ResetDatabase ();
            return All ();
        }

        [HttpPost]
        public IReadOnlyList<Item> CreateWeapon (
            [FromBody] Weapon weapon)
        {
            if (weapon.Id == null)
                weapon = new Weapon (
                    null,
                    weapon.Name,
                    weapon.CombatType,
                    weapon.Modifiers);
            ItemDatabase [weapon.Id] = weapon;
            return All ();
        }

        [HttpPost]
        public IReadOnlyList<Item> CreateItem (
            [FromBody] Item item)
        {
            if (item.Id == null)
                item = new Item (null, item.Type, item.Name, item.Modifiers);
            ItemDatabase [item.Id] = item;
            return All ();
        }
    }
}