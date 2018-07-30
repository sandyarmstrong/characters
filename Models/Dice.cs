using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace characters.Models
{
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
}