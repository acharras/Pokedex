import "./header.css"

export function Header() {

    return(
        <div className="Header">
            <div className="Navbar">
                {/*<form onSubmit={handleSearch} >
                    <input type="text" className="searchBar" placeholder="Search" value={search} onChange={handleInputSearch} />
                </form>
                <details>
                    <summary className="summaryProfile" style={{ backgroundImage: `url(${avatar})` }} ></summary>
                    <nav className="menu">
                        <button className="menuBtn" onClick={() => { return history.push(`/${me.username}/profile`) }} ><span /><span /><span /><span /><UserCircle /></button>
                        <button className="menuBtn" onClick={() => { return history.push(`/alerts`) }} ><span /><span /><span /><span /><Bell /></button>
                        <button className="menuBtn" onClick={() => { return history.push("/settings") }} ><span /><span /><span /><span /><Cog /></button>
                        <button className="menuBtnOut" onClick={logout} ><span /><span /><span /><span /><Logout /></button>
                    </nav>
    </details>*/}
            </div>
        </div>
    );
}