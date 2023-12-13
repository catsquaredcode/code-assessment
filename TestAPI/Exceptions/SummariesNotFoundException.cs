using System;

namespace TestAPI.Exceptions
{
    public class SummariesNotFoundException : Exception
    {
        public SummariesNotFoundException()
        {
        }

        public SummariesNotFoundException(string message)
            : base(message)
        {
        }

        public SummariesNotFoundException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }

}
