import React, { useEffect, useState } from "react";
import "./styles/style.css";
import Country from "./components/Countries";
import Modal from "./components/Modal";
import Pagination from "./components/Pagination";
import Navbar from "./components/Navbar";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [state, setState] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(9);
  const [modalProps, setModalProps] = useState([]);

  useEffect(() => {
    getCountry();
    setCurrentPage(1);
  }, [query]);

  //Methods for Modal display
  const showModal = (
    alpha2Code,
    capital,
    area,
    nativeName,
    cioc,
    subregion
  ) => {
    setState(true);
    console.log(alpha2Code);
    setModalProps({
      alpha2Code: alpha2Code,
      capital: capital,
      area: area,
      nativeName: nativeName,
      cioc: cioc,
      subregion: subregion,
    });
  };
  const hideModal = () => {
    setState(false);
  };
  //Get REST API
  const getCountry = async () => {
    let response;
    try {
      if (query === "") {
        response = await (
          await fetch("https://restcountries.eu/rest/v2/all")
        ).json();
        console.log(response);
      } else {
        response = await (
          await fetch("https://restcountries.eu/rest/v2/name/" + query)
        ).json();
        console.log(response);
        if (response.status === 404) {
          console.log("in if");
          response = await (
            await fetch(" https://restcountries.eu/rest/v2/capital/" + query)
          ).json();
          console.log(response);
          if (response.status === 404) {
            console.log("in if");
            response = await (
              await fetch(" https://restcountries.eu/rest/v2/lang/" + query)
            ).json();
            console.log(response);
          }

          if (response.status === 404) {
            console.log("in if");
            response = await (
              await fetch(
                " https://restcountries.eu/rest/v2/callingcode/" + query
              )
            ).json();
            console.log(response);
          }

          if (response.status === 404) {
            console.log("in if");
            response = await (
              await fetch(" https://restcountries.eu/rest/v2/region/" + query)
            ).json();
            console.log(response);
          }
        }
      }
      const data = await response;
      setCountries(data);
    } catch (error) {
      console.log(error);
      setCountries([{ name: "Page not found" }]);
    }
  };
  const updateState = (e) => {
    setSearch(e.target.value);
  };
  const getSearch = (e) => {
    e.preventDefault();
    setQuery(search);
  };

  //Pagination req.

  // Pagination variables
  const indexOfLastCountry = currentPage * perPage;
  const indexOfFirstCountry = indexOfLastCountry - perPage;
  const currentCountries = countries.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );
  //Pagination method
  const Paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const changePage = (val) => {
    if (val === 0) {
      setCurrentPage(currentPage - 1);
    } else if (val === 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <React.Fragment>
      {/* <nav>
        <form onSubmit={getSearch}>
          <input type="search" value={search} onChange={updateState} />
          <button type="submit">Search</button>
        </form>
      </nav> */}
      {/* <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top mb-5">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="/">
              Countries
            </a>
          </li>
        </ul>

        <form className="form-inline">
          <input
            className="form-control mr-sm-2"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(event) => updateState(event)}
          />
          <button
            className="btn btn-success"
            type="submit"
            onClick={() => getSearch()}
          >
            Search
          </button>
        </form>
      </nav> */}
      <Navbar />
      <div className="container border">
        <div className="row">
          {currentCountries.map((country) => (
            <Country
              showModal={showModal}
              key={country.alpha2Code}
              name={country.name}
              population={country.population}
              region={country.region}
              flag={country.flag}
              show={state}
              hideModal={hideModal}
              alpha2Code={country.alpha2Code}
              capital={country.capital}
              area={country.area}
              nativeName={country.nativeName}
              cioc={country.cioc}
              subregion={country.subregion}
            />
          ))}
        </div>
      </div>
      <div className="page-container">
        <Pagination
          perPage={perPage}
          totalPosts={countries.length}
          currentPage={currentPage}
          Paginate={Paginate}
          changePage={changePage}
        />
      </div>
      <Modal
        show={state}
        hideModal={hideModal}
        key={modalProps.alpha2Code}
        alpha2Code={modalProps.alpha2Code}
        capital={modalProps.capital}
        area={modalProps.area}
        nativeName={modalProps.nativeName}
        cioc={modalProps.cioc}
        subregion={modalProps.subregion}
      />
    </React.Fragment>
  );
};

export default App;
