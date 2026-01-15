const Review = require('../models/reviewModel');

exports.getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const [rows, total] = await Promise.all([
      Review.findAllPaging({ limit, offset, search }),
      Review.countAll({ search })
    ]);

    res.status(200).json({
      status: "success",
      total_records: total,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review non trouvée" });

    res.status(200).json({ status: "success", data: review });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { comment } = req.body;
    const id_user = req.userId;

    if (!comment) {
      return res.status(400).json({ status: "error", message: "Le commentaire est requis" });
    }

    const reviewId = await Review.create({ comment, id_user });

    res.status(201).json({
      status: "success",
      message: "Avis ajouté !",
      data: { id: reviewId, comment, id_user }
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const userRole = req.userRole;

  try {
    // 1. Chercher l'avis pour savoir à qui il appartient
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review non trouvée" });
    }

    if (userRole !== 'admin' && review.id_user !== userId) {
      return res.status(403).json({
        status: "error",
        message: "Vous n'avez pas l'autorisation de supprimer cet avis"
      });
    }

    const deleted = await Review.delete(id);

    res.status(200).json({ status: "success", message: "Review supprimée" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const userId = req.userId;     // ID de l'utilisateur connecté
  const userRole = req.userRole; // Rôle de l'utilisateur connecté

  try {
    if (!comment) {
      return res.status(400).json({ message: "Le commentaire est requis" });
    }

    // 1. On cherche l'avis existant
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review non trouvée" });
    }

    // 2. Vérification des droits : (Admin) OU (Propriétaire de l'avis)
    if (userRole !== 'admin' && review.id_user !== userId) {
      return res.status(403).json({
        status: "error",
        message: "Vous n'avez pas l'autorisation de modifier cet avis"
      });
    }

    // 3. Mise à jour
    await Review.update(id, { comment });

    res.status(200).json({
      status: "success",
      message: "Review mise à jour avec succès"
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};