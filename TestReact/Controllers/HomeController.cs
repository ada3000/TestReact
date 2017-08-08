using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace TestReact.Controllers
{
    //[Authorize]
    public class HomeController : Controller
    {
        private static readonly IList<CommentModel> _comments;

        static HomeController()
        {
            _comments = new List<CommentModel>
            {
                new CommentModel
                {
                    id = 1,
                    author = "Daniel Lo Nigro",
                    text = "Hello ReactJS.NET World!"
                },
                new CommentModel
                {
                    id = 2,
                    author = "Pete Hunt",
                    text = "This is one comment"
                },
                new CommentModel
                {
                    id = 3,
                    author = "Jordan Walke",
                    text = "This is *another* comment"
                },
            };
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Comments()
        {
            System.Threading.Thread.Sleep(2000);
            return Json(_comments, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddComment(CommentModel comment)
        {
            // Create a fake ID for this comment
            comment.id = _comments.Count + 1;
            _comments.Add(comment);
            return Content("Success :)");
        }

        [HttpPost]
        public ActionResult RemoveComment(int id)
        {
            var comment = _comments.FirstOrDefault(c => c.id == id);
            if (comment != null)
                _comments.Remove(comment);

            return Content("Success :)");
        }
    }

    public class CommentModel
    {
        public int id { get; set; }
        public string author { get; set; }
        public string text { get; set; }
    }
}
