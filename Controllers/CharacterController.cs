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
    public class CharacterController : Controller
    {
        // TODO: Real DB please
        static readonly Dictionary<string, Character> CharacterDatabase =
            new Dictionary<string, Character> ();
        
        static CharacterController ()
        {
            CharacterDatabase ["1"] = new Character (
                "Berresor",
                "Sandy",
                4,
                2,
                60,
                3,
                3,
                6,
                new [] {
                    new Weapon ("Dueling Sword", CombatType.Melee),
                    new Weapon ("Dueling Dagger", CombatType.Melee),
                    new Weapon ("Throwing Dagger", CombatType.Ranged),
                },
                new [] {
                    Item.CreateArmor (3, "Studded Leather"),
                });
        }

        [HttpGet("{id}")]
        public Character Summary(string id)
        {
            return CharacterDatabase [id];
        }

        [HttpPost("{id}")]
        public Character LevelUp(
            string id,
            [FromQuery] bool preview,
            [FromBody] List<Buff> upgrades)
        {
            // TODO: This should be immutable
            var character = CharacterDatabase [id].WithUpgrades (upgrades);

            if (!preview)
                CharacterDatabase [id] = character;
            
            return character;
        }
    }
}
