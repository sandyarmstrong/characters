using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace characters.Controllers
{
    [Route("api/[controller]/[action]")]
    public class CharacterController : Controller
    {
        readonly Dictionary<string, Character> CharacterDatabase =
            new Dictionary<string, Character> ();
        
        public CharacterController ()
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

    public struct Dice
    {
        public int Count { get; }

        public int Size { get; }

        public Dice (int count, int size)
        {
            Count = count;
            Size = size;
        }

        public static Dice Get (int val)
        {
            if ((val - 1) < 0)
                return Minimum;
            return AllDice [(val * 2) - 1];
        }

        static readonly Dice Minimum = new Dice (1, 3);

        static Dice [] AllDice = new [] {
            new Dice (1, 4),
            new Dice (1, 6),
            new Dice (2, 4),
            new Dice (1, 8),
            new Dice (1, 10),
            new Dice (2, 6),
            new Dice (3, 4),
            new Dice (1, 12),
            new Dice (2, 8),
            new Dice (4, 4),
            new Dice (3, 6),
            new Dice (1, 20),
            new Dice (5, 4),
            new Dice (2, 10),
            new Dice (3, 8),
            new Dice (4, 6),
            new Dice (6, 4),
            new Dice (2, 12),
            new Dice (7, 4),
            new Dice (3, 10),
            new Dice (5, 6),
            new Dice (4, 8),
            new Dice (8, 4),
            new Dice (3, 12),
            new Dice (6, 6),
            new Dice (2, 20),
            new Dice (4, 10),
            new Dice (5, 8),
            new Dice (7, 6),
            new Dice (6, 8),
            new Dice (8, 6),
            new Dice (4, 12),
            new Dice (5, 10),
            new Dice (7, 8),
            new Dice (5, 12),
            new Dice (3, 20),
            new Dice (6, 10),
            new Dice (8, 8),
            new Dice (7, 10),
            new Dice (6, 12),
            new Dice (4, 20),
            new Dice (8, 10),
            new Dice (7, 12),
            new Dice (8, 12),
            new Dice (5, 20),
            new Dice (1, 100),
            new Dice (6, 20),
            new Dice (7, 20),
            new Dice (8, 20),
            new Dice (2, 100),
            new Dice (3, 100),
            new Dice (4, 100),
            new Dice (5, 100),
            new Dice (6, 100),
            new Dice (7, 100),
            new Dice (8, 100),
        };
    }

    public struct CombatModifier
    {
        public CombatType CombatType { get; }

        public int DiceCount { get; }

        public int DiceSize { get; }

        public int Remainder { get; }

        public int FailPercentage { get; }

        public CombatModifier (
            CombatType combatType,
            int diceCount,
            int diceSize,
            int remainder,
            int failPercentage
        )
        {
            CombatType = combatType;
            DiceCount = diceCount;
            DiceSize = diceSize;
            Remainder = remainder;
            FailPercentage = failPercentage;
        }
    }

    public enum CombatType
    {
        Melee,
        Ranged,
        Spell
    }

    public enum BuffType
    {
        Strength,
        Dexterity,
        Mind,
        MeleeAttack,
        RangedAttack,
        SpellAttack,
        MeleeDefense,
        RangedDefense,
        SpellDefense,
        Heroism,
        Health
    }

    public struct Buff
    {
        public BuffType Type { get; }

        public int Modifier { get; }

        public Buff (BuffType type, int modifier)
        {
            Type = type;
            Modifier = modifier;
        }
    }

    public struct Defense
    {
        public CombatType Type { get; }

        public int Modifier { get; }

        public Defense (CombatType type, int modifier)
        {
            Type = type;
            Modifier = modifier;
        }
    }

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

    // TODO: Items and relevant slots (think amulets, which can only be
    //       worn one at a time)

    public class Character
    {
        public string Name { get; }

        public string PlayerName { get; }

        public int Level { get; }

        public int LevelsAvailable { get; }

        public int Experience { get; }

        public int Strength { get; }

        public int Dexterity { get; }
        
        public int Mind { get; }

        public int HitPoints { get; }

        public int Heroism { get; }

        public IReadOnlyList<Defense> Defenses { get; }

        public IReadOnlyList<Attack> Attacks { get; }

        public IReadOnlyList<Weapon> Weapons { get; }

        public Character (
            string name,
            string playerName,
            int level,
            int levelsAvailable,
            int experience,
            int strength,
            int dexterity,
            int mind,
            IReadOnlyList<Weapon> weapons
        )
        {
            Name = name;
            PlayerName = playerName;
            Level = level;
            LevelsAvailable = levelsAvailable;
            Experience = experience;
            Strength = strength;
            Dexterity = dexterity;
            Mind = mind;
            Weapons = weapons;

            // TODO: Account for item/weapon buffs throughout

            HitPoints = level * 6;
            Heroism = level;

            // TODO: Armor/shields, and use them in defenses
            Defenses = new List<Defense> {
                new Defense (CombatType.Melee, strength),
                new Defense (CombatType.Ranged, dexterity),
                new Defense (CombatType.Spell, mind),
            };

            Attack CreateFromWeapon (Weapon weapon, int abilityVal, int modifiedAbilityVal)
            {
                var dice = Dice.Get (modifiedAbilityVal);
                return new Attack (
                    weapon.Name,
                    new CombatModifier (
                        weapon.Type,
                        dice.Count,
                        dice.Size,
                        modifiedAbilityVal + 0, // TODO: what is CMBase supposed to be?
                        25 - abilityVal // TODO: Add in armor/shield
                    )
                );
            }

            Attack meleeAttack = null;
            Attack sidearmAttack = null;
            Attack rangedAttack = null;
            Attack spellAttack = null;

            foreach (var weapon in Weapons
                .Where (w => w.Type == CombatType.Melee)) {
                if (meleeAttack == null) {
                    meleeAttack = CreateFromWeapon (
                        weapon,
                        strength,
                        strength);
                    continue;
                }

                if (sidearmAttack == null) {
                    sidearmAttack = CreateFromWeapon (
                        weapon,
                        strength,
                        strength - 4);
                    break;
                }
            }

            // TODO: Or do we get a primary fist? Ask
            if (meleeAttack == null)
                throw new ArgumentException ("Missing melee weapon");

            if (sidearmAttack == null)
                sidearmAttack = CreateFromWeapon (
                    Weapon.Fists,
                    strength,
                    strength - 4);

            // TODO: Any sort of default ranged? Rock throwing?
            rangedAttack = Weapons
                .Where (w => w.Type == CombatType.Ranged)
                .Select (w => CreateFromWeapon (w, dexterity, dexterity))
                .FirstOrDefault ();
            
            var spellWeapon = Weapons
                .Where (w => w.Type == CombatType.Spell)
                .FirstOrDefault () ?? Weapon.Mind;
            spellAttack = CreateFromWeapon (spellWeapon, mind, mind);

            Attacks = new [] {
                meleeAttack,
                sidearmAttack,
                rangedAttack,
                spellAttack,
            };
        }

        public Character WithUpgrades (List<Buff> upgrades)
        {
            var strBuff = 0;
            var dexBuff = 0;
            var mindBuff = 0;

            foreach (var buff in upgrades) {
                switch (buff.Type) {
                case BuffType.Strength:
                    strBuff += buff.Modifier;
                    break;
                case BuffType.Dexterity:
                    dexBuff += buff.Modifier;
                    break;
                case BuffType.Mind:
                    mindBuff += buff.Modifier;
                    break;
                default:
                    throw new ArgumentException (
                        "Only strength, dexterity, and mind can be leveled up");
                }
            }

            var totalBuff = strBuff + dexBuff + mindBuff;
            if (totalBuff > LevelsAvailable)
                throw new ArgumentException (
                    $"You have selected {totalBuff} buffs, but only " +
                    $"{LevelsAvailable} are currently available");
            
            return new Character (
                Name,
                PlayerName,
                Level,
                LevelsAvailable - totalBuff,
                Experience,
                Strength + strBuff,
                Dexterity + dexBuff,
                Mind + mindBuff,
                Weapons);
        }
    }
}
