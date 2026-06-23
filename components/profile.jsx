import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import "./styles/profile.css";
import Navbar from "./utils/Navbar.jsx";
function Profile() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    street: "",
    house_number: "",
    city: "",
    postal_code: "",
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("https://pizzarokilive.onrender.com/profile", {
          withCredentials: true,
        });

        setForm(prev => ({
          ...prev,
          email: res.data.email || "",
          phone: res.data.phone || "",
          street: res.data.street || "",
          house_number: res.data.house_number || "",
          city: res.data.city || "",
          postal_code: res.data.postal_code || "",
        }));

        setIsGoogleUser(res.data.isGoogleUser);
        setLoading(false);
      } catch {
        window.location.replace("/login");
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center mt-5">Profil betöltése…</div>;

  const handleChange = (e) => {
    setErrorMessage("");
    setSuccessMessage("");

    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isGoogleUser && !form.oldPassword) {
      return setErrorMessage("A mentéshez add meg a jelenlegi jelszavad!");
    }

    if (!emailRegex.test(form.email)) {
      return setErrorMessage("Érvénytelen email cím!");
    }

    if (form.newPassword && !strongPasswordRegex.test(form.newPassword)) {
      return setErrorMessage(
        "Az új jelszónak tartalmaznia kell kis- és nagybetűt, számot és speciális karaktert!"
      );
    }

    setSaving(true);

    try {
      const payload = { ...form };

      if (!payload.newPassword) delete payload.newPassword;

      const res = await axios.put("https://pizzarokilive.onrender.com/profile", payload, {
        withCredentials: true,
      });

      setSuccessMessage(res.data.message);
      setForm(prev => ({ ...prev, oldPassword: "", newPassword: "" }));
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Hiba történt");
    } finally {
      setSaving(false);
    }
  };

 
  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMessage("");
    setSuccessMessage("");
    setSaving(true);

    try {
      const res = await axios.put(
        "https://pizzarokilive.onrender.com/profile/google-update",
        {
          credential: credentialResponse.credential,
          ...form,
        },
        { withCredentials: true }
      );

      setSuccessMessage(res.data.message);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Google hitelesítés sikertelen");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page1">
      <Navbar isMenuPage={true} />
    <div className="container profile-page mt-5 mb-2">
    
      <div className="profile-card p-7 shadow rounded">
        <h2 className="mb-4 text-center">Profil adatok</h2>

        {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label>Email</label>
            <input name="email" className="form-control" value={form.email} onChange={handleChange}/>
          </div>

          <div className="col-md-6">
            <label>Telefonszám</label>
            <input name="phone" className="form-control" value={form.phone} onChange={handleChange}/>
          </div>

          <div className="col-md-4">
            <label>Utca</label>
            <input name="street" className="form-control" value={form.street} onChange={handleChange}/>
          </div>

          <div className="col-md-2">
            <label>Házszám</label>
            <input name="house_number" className="form-control" value={form.house_number} onChange={handleChange}/>
          </div>

          <div className="col-md-4">
            <label>Város</label>
            <input name="city" className="form-control" value={form.city} onChange={handleChange}/>
          </div>

          <div className="col-md-2">
            <label>Irányítószám</label>
            <input name="postal_code" className="form-control" value={form.postal_code} onChange={handleChange}/>
          </div>

          {!isGoogleUser && (
            <>
              <hr className="mt-4" />
              <div className="col-md-6">
                <label>Jelenlegi jelszó</label>
                <input type="password" name="oldPassword" className="form-control"
                  value={form.oldPassword} onChange={handleChange}/>
              </div>

              <div className="col-md-6">
                <label>Új jelszó (nem kötelező!)</label>
                <input type="password" name="newPassword" className="form-control"
                  value={form.newPassword} onChange={handleChange}/>
              </div>
            </>
          )}

          <div className="col-md-7 mt-4 mx-auto">
            {!isGoogleUser ? (
              <button type="submit" className="btn btn-warning w-100" disabled={saving}>
                {saving ? "Mentés..." : "Mentés"}
              </button>
            ) : (
              <button type="button" className="btn btn-warning w-100 mb-3 " disabled={saving}>
                {saving ? "Google hitelesítés..." : "Mentéshez jelentkezz be Google fiókoddal!"}
              
           
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setErrorMessage("Google hitelesítés sikertelen")}
              />
              </button>
            )}
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}

export default Profile;
