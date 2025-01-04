import React from "react";
import "./Header.css";

function Header() {
    return (
        <header className="gothic-header">
            <div className="crescent-moon"></div> {/* Glowing Crescent Moon */}
            <div className="profile-container">
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9DC08yhwYWEcp4A_qpzGdSPfJSDM42h6GHA&s"
                    alt="Profile"
                    className="profile-image"
                />
                <h1 style={{color:"red"}} >*:･ﾟ✧*:･ﾟ✧</h1>
                <h1 className="header-title">I’m ¥oungJinsu ☾</h1>
                <h1 style={{color:"red"}}>*:･ﾟ✧*:･ﾟ✧</h1>
                <p className="header-subtitle">
                    ✞☏༒☠︎︎⬈ Vibe with me if you like <strong>Phonk</strong>, <strong>Suicideboys</strong>, or <strong>Ghostemane</strong>. ⬉☠︎︎༒☏✞
                </p>
            </div>
        </header>
    );
}

export default Header;
