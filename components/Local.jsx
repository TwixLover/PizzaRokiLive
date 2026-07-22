
import React, {useState} from "react";
import "./styles/local.css";


function Local() {
  const [count, setCount] = useState(0)

  return (
   <div className="container-1">
<section className="come-visit-us" id="about">
  <div className="container">
    <h2>Come Visit Us!</h2>
    <p>Step into our fully equipped space where while you wait for your delicious food, you can catch your favorite sport, challenge your friends to a game of darts, or simply enjoy a refreshing cold drink.</p>
    <div className="image-grid">
      <div className="grid-item">
        <img src="https://media.istockphoto.com/id/1670575525/photo/sports-fans-watching-a-match-at-bar.jpg?s=612x612&w=0&k=20&c=NSJz2sMbragpuKHdIopXvi9Ckds5Puqgt91UXq1O6yo=" alt="Watching Sport"></img>
      </div>
      <div className="grid-item">
        <img src="https://media.istockphoto.com/id/1432161651/photo/young-man-playing-darts.jpg?s=2048x2048&w=is&k=20&c=LdjLisV5uqNfi1l-GZGr0UXeI6wce9W05wWWr4IzxEA=" alt="Playing Darts"></img>
      </div>
      <div className="grid-item">
        <img src="https://media.istockphoto.com/id/962573364/photo/group-of-happy-friends-drinking-and-toasting-beer-at-brewery-bar-restaurant-friendship-concept.jpg?s=2048x2048&w=is&k=20&c=HxDjAQDNGiJ1S-IWHFVaJnqhVTzrNYYNmN9ZAX5Jzs4=" alt="Enjoying a Drink"></img>
      </div>
      <div className="grid-item">
        <img src="https://media.istockphoto.com/id/870203548/photo/bored-woman-alone-at-restaurant.jpg?s=2048x2048&w=is&k=20&c=-hl2jyyVljAyItjE0jm2yKa_CJU1-IQHq28OQRICNmg=" alt="Waiting for Food"></img>
      </div>
    </div>
  </div>
</section>
<section className="come-visit-us">
  <div className="container">
    <div className="event-hire-block"  id="locations">
        <h2>🎉 Planning an Event?</h2>
        <p>Looking for the perfect venue for a birthday, corporate gathering, or any special occasion? **Our fully equipped room is available for private hire!** Get the party started—booking your exclusive space is also just **one phone call away!**</p>
        <button className="call-to-action">Call Us to Book Now!</button>
    </div>
    <div className="location-map">
        <h3>📍 Where to find us?</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2807.591242398516!2d20.385573776269668!3d45.385869440626086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a409745a8ab4b%3A0x1d4734612e4f3a74!2sAranj%20Jano%C5%A1a%2032a%2C%20Zrenjanin%2023000%2C%20Serbia!5e0!3m2!1sen!2shu!4v1700000000000!5m2!1sen!2shu"
            allowFullScreen="" 
            loading="lazy" 
            referrerP0olicy="no-referrer-when-downgrade">
        </iframe>
        <p className="address-text">Aranj Janosa 32a, Zrenjanin</p>
    </div>
  </div>
</section>


   </div>
    
  )
}
export default Local ;