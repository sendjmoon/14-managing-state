(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  // DONE: What does this method do?  What is it's execution path?
  articlesController.loadById = function(ctx, next) {
    // loads the article from the context object
    var articleData = function(article) {
      // assigns the context object's articles parameter to the article argument
      ctx.articles = article;
      // sends to the next callback function
      next();
    };

    // takes the context id's value and passes it to find the matching article
    Article.findWhere('id', ctx.params.id, articleData);
  };

  // DONE: What does this method do?  What is it's execution path?
  articlesController.loadByAuthor = function(ctx, next) {
    // loads the matching article by the author from the context object
    var authorData = function(articlesByAuthor) {
      // assings the context object's articles parameter to the matching articles by author
      ctx.articles = articlesByAuthor;
      // sends to the next callback function
      next();
    };

    // loads the author with the matching author's articles
    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

  // DONE: What does this method do?  What is it's execution path?
  articlesController.loadByCategory = function(ctx, next) {
    // loads articles under the matching category
    var categoryData = function(articlesInCategory) {
      // assigns the object's articles to the matching article category
      ctx.articles = articlesInCategory;
      // sends to the next callback function
      next();
    };

    // loads the category with the matching category's articles
    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // DONE: What does this method do?  What is it's execution path?
  articlesController.loadAll = function(ctx, next) {
    // loads the articles from the Article.all array
    var articleData = function(allArticles) {
      // assigns the context object's articles attribute to the Article.all array data
      ctx.articles = Article.all;
      // sends to next callback function
      next();
    };
    // checks to see if Article.all has any data
    if (Article.all.length) {
      // will use existing Article.all array data
      ctx.articles = Article.all;
      // sends to next callback function
      next();
    // moves below if there is no Article.all data
    } else {
      // creates data because none exists
      Article.fetchAll(articleData);
    }
  };


  module.articlesController = articlesController;
})(window);
