(function(module) {

  var articleView = {};

  var render = function(article) {
    var template = Handlebars.compile($('#article-template').text());

    article.daysAgo = parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);
    article.publishStatus = article.publishedOn ? 'published ' + article.daysAgo + ' days ago' : '(draft)';
    article.body = marked(article.body);

    return template(article);
  };

  // Done: What does this method do?  What is it's execution path?
  //states a function named populateFilters, which fills the dropdown menu with author and category names
  articleView.populateFilters = function() {
    //declares the variable options
    var options,
    //compiles option template with text from  options collected
      template = Handlebars.compile($('#option-template').text());

    // Example of using model method with FP, synchronous approach:
    // This method is dependant on info being in the DOM. Only authors of shown articles are loaded.
    //going through all authors of the article array and returning a template for each
    options = Article.allAuthors().map(function(author) { return template({val: author}); });
    //If there is only one (because there CAN only be one),
    if ($('#author-filter option').length < 2) { // Prevent duplication
      // this writes the returned template for handlebars to the id author-filter
      $('#author-filter').append(options);
    };

    // Example of using model method with async, SQL-based approach:
    // This approach is DOM-independent, since it reads from the DB directly.
    // going through all categories of the article array and...
    Article.allCategories(function(rows) {
      // if there is less than 2
      if ($('#category-filter option').length < 2) {
        // writes to the category menu
        $('#category-filter').append(
          // takes each category and
          rows.map(function(row) {
            // returns their value
            return template({val: row.category});
          })
        );
      };
    });
  };

  // Done: What does this method do?  What is it's execution path?
  //This method changes the url when an option is selected or changed
  articleView.handleFilters = function() {
    // when an option is selected
    $('#filters').one('change', 'select', function() {
      // removes -filter from url
      resource = this.id.replace('-filter', '');
      // this calls the page by using the author or categories value and replaces whitespace with a '+'
      page('/' + resource + '/' + $(this).val().replace(/\W+/g, '+')); // Replace any/all whitespace with a +
    });
  };
  // articleView.handleAuthorFilter = function() {
  //   $('#author-filter').on('change', function() {
  //     if ($(this).val()) {
  //       $('article').hide();
  //       $('article[data-author="' + $(this).val() + '"]').fadeIn();
  //     } else {
  //       $('article').fadeIn();
  //       $('article.template').hide();
  //     }
  //     $('#category-filter').val('');
  //   });
  // };
  //
  // articleView.handleCategoryFilter = function() {
  //   $('#category-filter').on('change', function() {
  //     if ($(this).val()) {
  //       $('article').hide();
  //       $('article[data-category="' + $(this).val() + '"]').fadeIn();
  //     } else {
  //       $('article').fadeIn();
  //       $('article.template').hide();
  //     }
  //     $('#author-filter').val('');
  //   });
  // };

  // DONE: Remove the setTeasers method, and replace with a plain ole link in the article template.
  // articleView.setTeasers = function() {
  //   $('.article-body *:nth-of-type(n+2)').hide();
  //
  //   $('#articles').on('click', 'a.read-on', function(e) {
  //     e.preventDefault();
  //     $(this).parent().find('*').fadeIn();
  //     $(this).hide();
  //   });
  // };

  articleView.initNewArticlePage = function() {
    $('#articles').show().siblings().hide();

    $('#export-field').hide();
    $('#article-json').on('focus', function(){
      this.select();
    });

    $('#new-form').on('change', 'input, textarea', articleView.create);
  };

  articleView.create = function() {
    var formArticle;
    $('#articles').empty();

    // Instantiate an article based on what's in the form fields:
    formArticle = new Article({
      title: $('#article-title').val(),
      author: $('#article-author').val(),
      authorUrl: $('#article-author-url').val(),
      category: $('#article-category').val(),
      body: $('#article-body').val(),
      publishedOn: $('#article-published:checked').length ? new Date() : null
    });

    $('#articles').append(render(formArticle));

    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });

    // Export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
    $('#export-field').show();
    $('#article-json').val(JSON.stringify(article) + ',');
  };

  // Done: What does this method do?  What is it's execution path?
  // This method chooses which articles display and which ones do not
  articleView.index = function(articles) {
    //This displays articles and hides everything else
    $('#articles').show().siblings().hide();
    // This removes all articles
    $('#articles article').remove();
    // Then does a function for each element in the array
    articles.forEach(function(a) {
      // which renders the elements to the articles id
      $('#articles').append(render(a));
    });

    articleView.populateFilters();
    // Done: What does this method do?  What is it's execution path?
    // this runs the function for selecting articles when an author or category is clicked on
    articleView.handleFilters();

    // DONE: Replace setTeasers with just the truncation logic, if needed:
    if ($('#articles article').length > 1) {
      $('.article-body *:nth-of-type(n+2)').hide();
    }
  };

  articleView.initAdminPage = function() {
    var template = Handlebars.compile($('#author-template').text());

    Article.numWordsByAuthor().forEach(function(stat) {
      $('.author-stats').append(template(stat));
    });

    $('#blog-stats .articles').text(Article.all.length);
    $('#blog-stats .words').text(Article.numWordsAll());
  };

  module.articleView = articleView;
})(window);
