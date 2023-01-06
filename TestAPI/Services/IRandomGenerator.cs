using System;

namespace TestAPI.Services
{
    public interface IRandomGenerator
    {
        int Next(int firstNum, int secondNum);
    }
}
