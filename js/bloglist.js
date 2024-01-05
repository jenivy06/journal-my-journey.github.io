$(document).ready(function() {

 
  // blog container holds blogs
  var blogContainer = $(".blog-container");
  var blogCategorySelect = $("#category");
  var blogLocationSelect = $("#location");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleBlogDelete);
  $(document).on("click", "button.edit", handleBlogEdit);

  blogCategorySelect.on("change", handleCategoryChange);
  blogLocationSelect.on("change", handleLocationChange);
  var blogs;

  // This function grabs posts from the database and updates the view
  function getBlogs(category) {
    var categoryString = category || "";
    if (categoryString) {
      categoryString = "/category/" + categoryString;
    }
    $.get("/api/blogs" + categoryString, function(data) {
      console.log("Blogs", data);
      blogs = data;
      if (!blogs || !blogs.length) {
        displayEmpty();
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete posts
  function deleteBlog(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/blogs/" + id
    })
      .then(function() {
        getBlogs(blogCategorySelect.val());
      });
  }

  // Getting the initial list of blogs
  getBlogs();
  // InitializeRows handles appending all of our constructed post HTML inside
  // blogContainer
  function initializeRows() {
    blogContainer.empty();
    var blogsToAdd = [];
    for (var i = 0; i < blogs.length; i++) {
      blogsToAdd.push(createNewRow(blogs[i]));
    }
    blogContainer.append(blogsToAdd);
  }

  // This function constructs a blog's HTML
  function createNewRow(blog) {
    
    var newBlog = $("<div>");
    newBlog.addClass("card");
    var newBlogHeading = $("<div>");
    newBlogHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn");
    deleteBtn.css({
      "background-color": "black",
      "color": "white"
    })
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-default");
    var newBlogTitle = $("<h2>");
    var newBlogDate = $("<small>");
    
    var newBlogCategoryText = $("<h5>")
    // newBlogCategoryText.text("Category: ")
    // newBlogCategoryText.css({
    //   "color": "#8A985A",
    //   "float": "left",
    //   "margin-top": "75px",
    //   "margin-left": "100px"
      
    //})
    var newBlogCategory = $("<p>");
    newBlogCategory.text("Category: " + blog.category);
    newBlogCategory.css({
      "float": "left",
      "color": "#8A985A"
    });
    var newBlogLocation = $("<p>");
    var newBlogLocationText = $("<h5>")
    // newBlogLocationText.text("Location: ");
    // newBlogLocationText.css({
    //     "color": "#8A985A",
    //     "float": "left",
    //     "margin-top": "10px"
        
    //     })
    
    newBlogLocation.text("Location: " + blog.location);
    newBlogLocation.css({
      "float": "left",
      "font-weight": "700",
      "margin-top":
      "20px",
      "margin-left": "-75px",
      "color": "#BB7E64"
    });
    var newBodyInputArea = $("<div>");
    newBodyInputArea.addClass("card-body");
    var newBlogBody = $("<p>");
    newBlogBody.css({
      "margin-left": "50px",
      "margin-top": "25px"
    })
    newBlogTitle.text(blog.title + " ");
    newBlogTitle.css({
      "text-decoration": "underline"
    })
    newBlogBody.text(blog.body);
    var formattedDate = new Date(blog.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    newBlogDate.text(formattedDate);
    newBlogDate.css({
      "float": "right"
    })
    newBlogTitle.append(newBlogDate);
    newBlogHeading.append(deleteBtn);
    newBlogHeading.append(editBtn);
    newBlogHeading.append(newBlogTitle);
    // newBlogHeading.append(newBlogCategoryText);
    // newBlogHeading.append(newBlogLocationText);
    newBlogHeading.append(newBlogCategory);
    newBlogHeading.append(newBlogLocation);
    newBlogBody.append(newBlogBody);
    newBlog.append(newBlogHeading);
    newBlog.append(newBlogBody);
    newBlog.data("blog", blog);
    return newBlog;
  }


  // This function figures out which post we want to delete and then calls
  // deletePost
  function handleBlogDelete() {
    var currentBlog = $(this)
      .parent()
      .parent()
      .data("blog");
    deleteBlog(currentBlog.id);
  }

  // This function figures out which post we want to edit and takes it to the
  // Appropriate url
  function handleBlogEdit() {
    var currentBlog = $(this)
      .parent()
      .parent()
      .data("blog");
    window.location.href = "/blogform?blog_id=" + currentBlog.id;
  }

  // This function displays a message when there are no blogs
  function displayEmpty() {
    blogContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-bottom": "1000px" });
    messageH2.html("No blogs yet for this category! Click <a href='/blogform'><i>here</i></a> in order to create a new blog.");
    blogContainer.append(messageH2);
  }

  // This function handles reloading new blogs when the category changes
  function handleCategoryChange() {
    var newBlogCategory = $(this).val();
    getBlogs(newBlogCategory);
  }

  // This function handles reloading new blogs when the location changes
  function handleLocationChange() {
    var newBlogLocation = $(this).val();
    getBlogs(newBlogLocation);
  }

});