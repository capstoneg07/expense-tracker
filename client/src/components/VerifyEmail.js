import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";

const VERIFY_EMAIL = gql`
  mutation verifyEmail($token: String!) {
    verifyEmail(token: $token)
  }
`;

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verifyEmail, { loading, error }] = useMutation(VERIFY_EMAIL);

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        const response = await verifyEmail({ variables: { token } });
        alert(response.data.verifyEmail);
        navigate("/login"); // Redirect to login page after successful verification
      } catch (err) {
        alert("Verification failed. Please try again or contact support.");
        console.error(err);
      }
    };

    verifyUserEmail();
  }, [token, verifyEmail, navigate]);

  if (loading) return <div>Verifying your email...</div>;
  if (error) return <div>Error verifying email: {error.message}</div>;

  return <div>Verifying your email...</div>;
};

export default VerifyEmail;
