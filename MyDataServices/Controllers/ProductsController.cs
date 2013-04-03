using MyDataServices.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace MyDataServices.Controllers
{
    public class ProductsController : ApiController
    {
        List<Product> ProductContext;

        public ProductsController()
        {
            if (HttpContext.Current.Application["productContext"] == null)
            {
                HttpContext.Current.Application["productContext"] = new List<Product>();
                ((List<Product>)HttpContext.Current.Application["productContext"]).Add(
                    new Product { Sku = "12345", Name = "Product 1", IsDeleted = false, Description = "Description 1" });
                ((List<Product>)HttpContext.Current.Application["productContext"]).Add(
                    new Product { Sku = "2345", Name = "Product 2", IsDeleted = false, Description = "Description 2" });
            }
            ProductContext = (List<Product>)(HttpContext.Current.Application["productContext"]);
        }

        // GET api/values
        public IEnumerable<Product> Get()
        {
            return ProductContext;
        }

        // GET api/values/5
        public Product Get(string sku)
        {
            Product current = ProductContext.Find(b => b.Sku.Equals(sku, StringComparison.OrdinalIgnoreCase) && !b.IsDeleted);
            if (current == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            else
            {
                return current;
            }
        }

        // POST api/values
        public void Post([FromBody]Product value)
        {
            ProductContext.Add(value);
        }

        // PUT api/values/5
        public void Put(string sku, [FromBody]Product value)
        {
            Product current = ProductContext.Find(b => b.Sku.Equals(sku, StringComparison.OrdinalIgnoreCase));
            if (current == null || current.IsDeleted)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            else
            {
                current.Name = value.Name;
                current.Description = value.Description;
                current.IsDeleted = value.IsDeleted;
            }
        }

        // DELETE api/values/5
        public void Delete(string sku)
        {
            Product current = ProductContext.Find(b => b.Sku.Equals(sku, StringComparison.OrdinalIgnoreCase));
            if (current == null || current.IsDeleted)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            else
            {
                current.IsDeleted = true;
            }
        }

    }
}