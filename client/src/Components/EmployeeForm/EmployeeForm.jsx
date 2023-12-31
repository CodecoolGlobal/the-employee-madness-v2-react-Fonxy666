import { useState, useEffect } from "react";
import Loading from "../Loading";

const EmployeeForm = ({ onSave, disabled, employee, onCancel }) => {

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(employee?.name ?? "");
  const [level, setLevel] = useState(employee?.level ?? "");
  const [position, setPosition] = useState(employee?.position ?? "");
  const [equipment, setEquipment] = useState(employee?.equipment ?? "");
  const [favouriteBrand, setFavouriteBrand] = useState(employee?.favouriteBrand ?? "");
  const [favouriteColor, setFavouriteColor] = useState(employee?.favouriteColor ?? "");
  const [currentSalary, setCurrentSalary] = useState(employee?.currentSalary ?? 0);
  const [desiredSalary, setDesiredSalary] = useState(employee?.desiredSalary ?? 0);
  const [startingDate, setStartingDate] = useState(employee?.startingDate ?? new Date());
  const [division, setDivision] = useState(employee?.division ?? "");
  const [favouriteBrandInput, setFavouriteBrandInput] = useState(``);
  const [divisionInput, setDivisionInput] = useState(``);
  const [allEquipments, setAllEquipments] = useState(``);
  const [allBrands, setAllBrands] = useState(``);
  const [divisions, setDivisions] = useState(``);

  //data fetching
  useEffect(() => {
    const fetchData = async (url, setter) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setter(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData(`http://127.0.0.1:8080/api/equipments`, setAllEquipments);
    fetchData(`http://127.0.0.1:8080/api/brands`, setAllBrands);
    fetchData(`http://127.0.0.1:8080/api/divisions`, setDivisions);
    fetchData(`http://127.0.0.1:8080/api/divisions/${division}`, setDivision);
  }, []);

  //fetching brands
  useEffect(() => {
    const getBrand = () => {
      if (allBrands && employee) {
        return allBrands.find(brand => brand._id === employee.favouriteBrand);
      } else {
        return `nothing`;
      }
    }
    setFavouriteBrand(getBrand());
    allBrands? setLoading(false) : void 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBrands]);

  //getting brand id's to work with them later on
  useEffect(() => {
    const getId = () => {
      if (favouriteBrandInput && allBrands) {
        allBrands.find(brand => {
          if (brand.name === favouriteBrandInput) {
            setFavouriteBrand(brand);
            return true;
          }
          return false;
        });
      }
    };
    getId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favouriteBrandInput]);

  //getting the divisions to swap to them in update
  useEffect(() => {
    const getId = () => {
      if (divisionInput && divisions) {
        divisions.find(division => {
          if (division.name === divisionInput) {
            setDivision(division);
            return true;
          }
          return false;
        });
      }
    };
    getId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divisionInput]);

  //submit function
  const onSubmit = (e) => {
    e.preventDefault();

    if (employee) {
      return onSave({
        ...employee,
        name,
        level,
        position,
        equipment,
        favouriteBrand,
        favouriteColor,
        currentSalary,
        desiredSalary,
        startingDate,
        division
      });
    }

    return onSave({
      name,
      level,
      position,
      equipment,
      favouriteBrand,
      favouriteColor,
      currentSalary,
      desiredSalary,
      startingDate,
      division
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <form className="EmployeeForm" onSubmit={onSubmit}>
      
      <div className="control">
        <label htmlFor="name">Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          id="name"
        />
      </div>

      <div className="control">
        <label htmlFor="level">Level:</label>
        <input
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          name="level"
          id="level"
        />
      </div>

      <div className="control">
        <label htmlFor="position">Position:</label>
        <input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          name="position"
          id="position"
        />
      </div>

      <div className="control">
        <label htmlFor="equipment">Equipment:</label>
        <select
          onChange={(e) => setEquipment(e.target.value)}
          name = "equipment"
          id = "position"
          value = {`${equipment}`}
        >
          <option>Nothing</option>
          {allEquipments &&
            allEquipments.map((gear) => (
              <option key = { gear.name }>
                {gear.name}
              </option>
            ))}
        </select>
      </div>

      <div className="control">
        <label htmlFor="fav_brand">Favourite brand:</label>
        <select
          onChange={(e) => setFavouriteBrandInput(e.target.value)}
          name = "fav_brand"
          id = "favBrand"
          value = {favouriteBrand.name}
        >
          <option>Nothing</option>
          {allBrands &&
            allBrands.map((brand) => (
              <option key = { brand.name }>
                {brand.name}
              </option>
            ))}
        </select>
      </div>

      <div className="control">
        <label htmlFor="colour">Favourite colour:</label>
        <input
          type="color"
          value={favouriteColor}
          onChange={(e) => setFavouriteColor(e.target.value)}
          name="color"
          id="color"
        />
      </div>

      <div className="control">
        <label htmlFor="currSalary">Current salary:</label>
        <input
          value={currentSalary}
          onChange={(e) => setCurrentSalary(e.target.value)}
          name="currentSalary"
          id="currentSalary"
        />
      </div>

      {employee? (
        <div>
          <div className="control">
            <label htmlFor="desiredSalary">Desired salary:</label>
            <input
              value={desiredSalary}
              onChange={(e) => setDesiredSalary(e.target.value)}
              name="currentSalary"
              id="currentSalary"
            />
          </div>
          <div>Salary difference: {desiredSalary - currentSalary + ` $ / year`}</div>

        </div>
      ) : void 0}

      <div className="control">
        <label htmlFor="startingDate">Starting date:</label>
        <input
          type="date"
          value={employee? startingDate.split(`T`)[0] : void 0}
          onChange={(e) => setStartingDate(new Date(e.target.value))}
          name="startingDate"
          id="startingDate"
        />
      </div>

      <div className="control">
        <label htmlFor="division">Division:</label>
        <select
          onChange={(e) => setDivisionInput(e.target.value)}
          name = "division"
          id = "favBrand"
          value = {division && division.name}
        >
          {divisions &&
            divisions.map((div) => (
              <option key = { div._id }>
                {div.name}
              </option>
            ))}
        </select>
      </div>

      <div className="buttons">
        <button type="submit" disabled={disabled}>
          {employee ? "Update Employee" : "Create Employee"}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
