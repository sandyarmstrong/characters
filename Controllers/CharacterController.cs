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
        // TODO: Real DB please (or, screw that, just persist to json)
        static readonly Dictionary<string, Character> CharacterDatabase =
            new Dictionary<string, Character> ();

        static CharacterController ()
        {
            ResetDatabase ();
        }
        
        static void ResetDatabase ()
        {
            CharacterDatabase.Clear ();
            UpsertCharacter (new Character (
                "1",
                "Berresor",
                "Sandy",
                4,
                2,
                60,
                3,
                3,
                6,
                null,
                new [] {
                    new Weapon ("Dueling Sword", CombatType.Melee),
                    new Weapon ("Dueling Dagger", CombatType.Melee),
                    new Weapon ("Throwing Dagger", CombatType.Ranged),
                },
                new [] {
                    Item.CreateArmor (3, "Studded Leather"),
                }));
        }

        static void UpsertCharacter (Character character)
        {
            CharacterDatabase [character.Id] = character;
        }

        [HttpGet]
        public IReadOnlyList<Character> All ()
        {
            return CharacterDatabase.Values.ToArray ();
        }

        [HttpPost]
        public IReadOnlyList<Character> Reset ()
        {
            ResetDatabase ();
            return All ();
        }

        [HttpPost]
        public IReadOnlyList<Character> GrantLevels (
            [FromBody] List<string> ids)
        {
            foreach (var id in ids) {
                if (!CharacterDatabase.TryGetValue (id, out var character))
                    continue; // TODO: Log it
                UpsertCharacter (character.WithLevelsAvailable (
                    character.LevelsAvailable + 1));
            }
            return All ();
        }

        [HttpPost("{id}")]
        public Character UpdateNotes (
            string id,
            [FromBody] string notes)
        {
            var character = CharacterDatabase [id].WithNotes (notes);
            UpsertCharacter (character);
            return character;
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
