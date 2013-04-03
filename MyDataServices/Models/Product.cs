using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyDataServices.Models
{
    public class Product
    {
        public string Sku { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsDeleted { get; set; }
    }
}