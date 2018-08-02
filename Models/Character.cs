using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace characters.Models
{
    public class Character
    {
        public string Id { get; }

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

        public string Notes { get; }

        public IReadOnlyList<Defense> Defenses { get; }

        public IReadOnlyList<Attack> Attacks { get; }

        public IReadOnlyList<Weapon> Weapons { get; }

        public IReadOnlyList<Item> Items { get; }

        public Character (
            string id,
            string name,
            string playerName,
            int level,
            int levelsAvailable,
            int experience,
            int strength,
            int dexterity,
            int mind,
            string notes,
            IReadOnlyList<Weapon> weapons,
            IReadOnlyList<Item> items)
        {
            Id = id
                ?? throw new ArgumentNullException (nameof (id));
            Name = name
                ?? throw new ArgumentNullException (nameof (name));
            PlayerName = playerName
                ?? throw new ArgumentNullException (nameof (playerName));
            Level = level;
            LevelsAvailable = levelsAvailable;
            Experience = experience;
            Strength = strength;
            Dexterity = dexterity;
            Mind = mind;
            Notes = notes;
            Weapons = weapons.ToArray ();
            Items = items?.ToArray () ?? Array.Empty<Item> ();
            // TODO: Does it make sense that weapons are not just items?

            // TODO: Account for item/weapon buffs throughout

            HitPoints = level * 6;
            Heroism = level;

            var buffs = new Dictionary<BuffType, int> ();

            int GetBuff (BuffType type)
                => buffs.TryGetValue (type, out var buff) ? buff : 0;

            // TODO: Enforce item slots (can't have 2 active shields, etc)
            foreach (var item in Items) {
                foreach (var buff in item.Modifiers) {
                    if (buffs.TryGetValue (buff.Type, out var prevBuff))
                        buffs [buff.Type] = prevBuff + buff.Modifier;
                    else
                        buffs [buff.Type] = buff.Modifier;
                }
            }

            // TODO: Get buffs from weapons, too

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

            Defenses = new List<Defense> {
                new Defense (
                    CombatType.Melee,
                    strength + GetBuff (BuffType.MeleeDefense)),
                new Defense (
                    CombatType.Ranged,
                    dexterity + GetBuff (BuffType.RangedDefense)),
                new Defense (
                    CombatType.Spell,
                    mind + GetBuff (BuffType.SpellDefense)),
            };
        }

        public Character WithNotes (string notes)
        {
            const int maxLength = 15000;
            if (notes != null && notes.Length > maxLength)
                throw new ArgumentException (
                    $"Notes are limited to {maxLength} characters");

            if (notes == Notes)
                return this;

            return new Character (
                Id,
                Name,
                PlayerName,
                Level,
                LevelsAvailable,
                Experience,
                Strength,
                Dexterity,
                Mind,
                notes,
                Weapons,
                Items);
        }

        public Character WithLevelsAvailable (int levelsAvailable)
        {
            if (levelsAvailable == LevelsAvailable)
                return this;

            return new Character (
                Id,
                Name,
                PlayerName,
                Level,
                levelsAvailable,
                Experience,
                Strength,
                Dexterity,
                Mind,
                Notes,
                Weapons,
                Items);
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

            if (totalBuff == 0)
                return this;
            
            return new Character (
                Id,
                Name,
                PlayerName,
                Level + totalBuff,
                LevelsAvailable - totalBuff,
                Experience,
                Strength + strBuff,
                Dexterity + dexBuff,
                Mind + mindBuff,
                Notes,
                Weapons,
                Items);
        }
    }
}