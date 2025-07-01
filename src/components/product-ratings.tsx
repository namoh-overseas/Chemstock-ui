"use client";

import type React from "react";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useStore } from "@/store";
import toast from "react-hot-toast";
import { addRatings } from "@/app/api/user/addRatings";

export type Rating = {
  name: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type ProductRatingsProps = {
  productId: string;
  ratingCount: number;
  ratingSum: number;
  ratingAverage: number;
  ratings: Rating[];
};

export function formatDate(isoDate: string) {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  };

  return new Intl.DateTimeFormat("en-IN", options).format(date);
}

export default function ProductRatings({
  ratings,
  productId,
  ratingCount,
  ratingSum,
  ratingAverage,
}: ProductRatingsProps) {
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!userReview) {
      toast.error("Please enter a review");
      return;
    }

    if (!userName) {
      toast.error("Please enter your name");
      return;
    }

    if (!userEmail) {
      toast.error("Please enter your email");
      return;
    }

    setSubmitting(true);

    try {
      const response = await addRatings(
        productId,
        userName,
        userEmail,
        userRating,
        userReview
      );

      if (response) {
        ratingCount += 1;
        ratingSum += userRating;
        ratingAverage = ratingCount === 0 ? 0 : (ratingSum / (ratingCount * 5)) * 5;

        setUserRating(0);
        setUserReview("");
        setUserName("");
        setUserEmail("");
        setHoveredRating(0);
        ratings.unshift(response);
      }
    } catch (error) {
      toast.error("Failed to submit review");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {ratings?.length > 0 ? (
        <>
          <div className="border-b border-black/50 pb-2">
            <div className="flex  gap-3 mb-4">
              <span className="text-5xl font-semibold">
                {ratingAverage?.toFixed(1)}
              </span>
              <sub>
                <Star className={`size-6 fill-primary mb-2`} />
                <p className="">({ratingCount} ratings)</p>
              </sub>
            </div>
          </div>
          <div className="space-y-6">
            {ratings.map((rating, index) => (
              <div key={index} className="border-b pb-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {rating.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{rating.name}</h4>
                        <div className="flex items-center mt-1">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < rating.rating
                                    ? "fill-primary text-primary"
                                    : "fill-muted text-muted-foreground"
                                }`}
                              />
                            ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(rating.createdAt)}
                      </span>
                    </div>
                    <pre className="mt-2 text-gray-700 font-sans text-wrap">{rating.comment}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
        <form onSubmit={handleRatingSubmit} className="space-y-4">
          <div className="">
            <Label htmlFor="name" className="block mb-2">
              Your Name
            </Label>
            <input
              type="text"
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="ChemStock"
            />
          </div>
          <div className="">
            <Label htmlFor="email" className="block mb-2">
              Your Email
            </Label>
            <input
              type="email"
              id="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="chemstock74@gmail.com"
            />
          </div>
          <div>
            <Label htmlFor="rating" className="block mb-2">
              Your Rating
            </Label>
            <div className="flex items-center gap-1">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setUserRating(i + 1)}
                    onMouseEnter={() => setHoveredRating(i + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        i < (hoveredRating || userRating)
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
            </div>
          </div>

          <div>
            <Label htmlFor="review" className="block mb-2">
              Your Review
            </Label>
            <Textarea
              id="review"
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
            />
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>
    </div>
  );
}
