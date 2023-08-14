const brandCLTN = require("../../models/admin/brandDetails");
const categoryCLTN = require("../../models/admin/categoryDetails");
const productCLTN = require("../../models/admin/productDetails");
const userCLTN = require("../../models/users/userDetails");
const { search } = require("../../routes");

// collection page
exports.collection = async (req, res) => {
  try {
    let collectionId = req.query.query;
    let listing = req.session.listing;
    let listingName;
    let currentUser = null;
    const brands = await brandCLTN.find({ isDeleted: false });
    console.log(req.session.userId);
    if (req.session.userId) {
      currentUser = await userCLTN.findOne({ _id: req.session.userId });
    }

    if (!req.session.listingName) {
      listingName = "Our Collection";
    } else {
      listingName = req.session.listingName;
    }
    // view more
    if (
      collectionId == "viewMore" &&
      !req.session.sorted &&
      !req.session.filter &&
      !req.session.searched
    ) {
      listing = await productCLTN.find({ listed: true }).populate("brand");
      req.session.listing = listing;
      listingName = "Our Collection";
    } else if (
      !collectionId &&
      !req.session.sorted &&
      !req.session.filter &&
      !req.session.searched
    ) {
      listing = await productCLTN
        .find({ listed: true })
        .populate("brand")
        .limit(9);
      req.session.listing = listing;
      listingName = "Our Collection";
    } else if (req.session.searched) {
      listing = req.session.searchResult;
    }

    req.session.sorted = null;
    req.session.filter = null;
    req.session.searched = null;

    res.render("index/productListing", {
      cartCount: req.session.cartCount,
      wishlistCount: req.session.wishlistCount,
      session: req.session.userId,
      listingName,
      listing,
      brands,
      currentUser,
      documentTitle: "LAP4 YOU | COLLECTIONS",
    });
  } catch (error) {
    console.log("Error in Collection Page :" + error);
    const currentUser = await userCLTN.findById(req.session.userId);
    res.render("index/404", {
      documentTitle: "404 | Page Not Found",
      url: req.originalUrl,
      session: req.session.userId,
      currentUser,
    });
  }
};

// product filtering

exports.currentFilter = async (req, res) => {
  try {
    let currentFilter;
    let allProducts = await productCLTN
      .find({ listed: true })
      .populate("brand category");
    let searchClear;
    let listingName = req.body.listingName;

    if (req.body.brandId) {
      currentFilter = await productCLTN
        .find({ listed: true, brand: req.body.brandId })
        .populate("brand category");
      if (listingName !== "Our Collection") {
        currentFilter = currentFilter.filter((product) => {
          return product.category.name === listingName;
        });
      }
    } else {
      if (req.session.listingName == "Our Collection") {
        currentFilter = allProducts.slice(0, 9);
      } else if (req.body.filterBy == "none") {
        currentFilter = req.session.categorySort || req.session.listing;
      }
    }

    req.session.listing = currentFilter;
    req.session.filtered = currentFilter;
    req.session.filter = true;
    req.session.categorySort = null;
    req.session.sortBy = false;

    if (!currentFilter && !searchClear) {
      res.json({
        success: 0,
      });
    } else if (searchClear) {
      res.json({
        success: "clear",
      });
    } else {
      res.json({
        success: 1,
      });
    }
  } catch (error) {
    console.log("Error in Products Filter Page" + error);
    const currentUser = await userCLTN.findById(req.session.userId);
    res.render("index/404", {
      documentTitle: "404 | Page Not Found",
      url: req.originalUrl,
      session: req.session.userId,
      currentUser,
    });
  }
};

// Product Sorting

exports.sortBy = async (req, res) => {
  try {
    if (!req.session.listing) {
      req.session.listing = await productCLTN
        .find({ listed: true })
        .populate("brand");
    }
    let listing = req.session.listing;

    if (req.body.sortBy === "ascending") {
      listing = listing.sort((a, b) => a.RAMSSD[0].price - b.RAMSSD[0].price);
      req.session.listing = listing;
      console.log(listing[0].RAMSSD[0].price);
      req.session.sorted = 1;
      res.json({
        message: "sorted",
      });
    } else if (req.body.sortBy === "descending") {
      listing = listing.sort((a, b) => b.RAMSSD[0].price - a.RAMSSD[0].price);
      req.session.listing = listing;
      console.log(listing[0].RAMSSD[0].price);
      req.session.sorted = 1;
      res.json({
        message: "sorted",
      });
    } else if (req.body.sortBy === "newReleases") {
      listing = listing.sort((a, b) => {
        const idA = a._id.toString();
        const idB = b._id.toString();
        if (idA < idB) {
          return 1;
        } else if (idA > idB) {
          return -1;
        }
        return 0;
      });
      req.session.sorted = 1;
      req.session.listing = listing;
      res.json({
        message: "sorted",
      });
    }
    req.session.categorySort = null;
    req.session.filtered = null;
    req.session.sortBy = listing;
  } catch (error) {
    console.log("Error occured in Sorting : " + error);
    const currentUser = await userCLTN.findById(req.session.userId);
    res.render("index/404", {
      documentTitle: "404 | Page Not Found",
      url: req.originalUrl,
      session: req.session.userId,
      currentUser,
    });
  }
};

// Product Searching
exports.search = async (req, res) => {
  let searchResult = [];
  if (req.session.filtered) {
    const regex = new RegExp(req.body.searchInput, "i");
    req.session.filtered.forEach((product) => {
      if (regex.exec(product.name)) {
        searchResult.push(product);
      }
    });
  } else if (req.session.sortBy) {
    const regex = new RegExp(req.body.searchInput, "i");
    req.session.listing.forEach((product) => {
      if (regex.exec(product.name)) {
        searchResult.push(product);
        console.log(searchResult);
      }
    });
  } else if (req.session.categorySort) {
    const regex = new RegExp(req.body.searchInput, "i");
    req.session.categorySort.forEach((element) => {
      if (regex.exec(element.name)) {
        searchResult.push(element);
      }
    });
  } else {
    searchResult = await productCLTN.find({
      name: {
        $regex: req.body.searchInput,
        $options: "i",
      },
      listed: true,
    });
  }
  req.session.listing = searchResult;
  req.session.searchResult = searchResult;
  req.session.searched = true;
  res.json({
    message: "Searched",
  });
};

// categories Section
exports.category = async (req, res) => {
  try {
    let listing;
    let currentUser;
    const brands = await brandCLTN.find({ isDeleted: false });
    let currentCategory = await categoryCLTN.findById(req.params.id);

    if (req.session.userId) {
      currentUser = await userCLTN.findOne({ _id: req.session.userId });
    }
    if (req.params.id == "newReleases") {
      listing = await productCLTN.find({ isDeleted: false }).sort({ _id: -1 });
      req.session.categorySort = listing;
      res.render("index/productListing", {
        cartCount: req.session.cartCount,
        wishlistCount: req.session.wishlistCount,
        listing,
        documentTitle: "New Releases | LAP4YOU",
        listingName: "New Releases",
        session: req.session.userId,
        currentUser,
        brands,
      });
    } else if (req.session.sorted) {
      listing = req.session.listing;
      req.session.categorySort = listing;
      req.session.sorted = 0;

      res.render("index/productListing", {
        cartCount: req.session.cartCount,
        wishlistCount: req.session.wishlistCount,
        listing,
        documentTitle: `${currentCategory.name} | LAP4YOU`,
        listingName: `${currentCategory.name}`,
        session: req.session.userId,
        currentUser,
        brands,
      });
    } else {
      if (!req.session.filtered && !req.session.searched) {
        listing = await productCLTN
          .find({
            category: currentCategory._id,
            listed: true,
          })
          .populate("brand");
        req.session.listing = listing;
        req.session.categorySort = listing;
      } else if (req.session.filtered) {
        req.session.listing = req.session.filtered;
      } else if (req.session.searched) {
        req.session.listing = req.session.searchResult;
      }

      req.session.searched = false;
      req.session.sortBy = false;
      req.session.filtered = false;

      res.render("index/productListing", {
        cartCount: req.session.cartCount,
        wishlistCount: req.session.wishlistCount,
        listing: req.session.listing,
        documentTitle: `${currentCategory.name} | LAP4YOU`,
        listingName: `${currentCategory.name}`,
        session: req.session.userId,
        currentUser,
        brands,
      });
    }
  } catch (error) {
    console.log("Error in Product Category Page : " + error);
    const currentUser = await userCLTN.findById(req.session.userId);
    res.render("index/404", {
      documentTitle: "404 | Page Not Found",
      url: req.originalUrl,
      session: req.session.userId,
      currentUser,
    });
  }
};
