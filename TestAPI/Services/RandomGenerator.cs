using System;

namespace TestAPI.Services
{
    public class RandomGenerator : IRandomGenerator
    {
        private Random random;

        public RandomGenerator()
        {
            this.random = new Random();
        }

        /// <summary>
        /// Gets the next random number
        /// </summary>
        /// <param name="firstNum"></param>
        /// <param name="secondNum"></param>
        /// <returns></returns>
        public int Next(int firstNum, int secondNum)
        {
            return this.random.Next(firstNum, secondNum);
        }
    }
}
