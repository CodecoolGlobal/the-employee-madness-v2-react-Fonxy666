import { useState, useEffect } from "react";
import Loading from "../Loading";

const EmployeeForm = ({ onSave, disabled, employee, onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(employee?.name ?? "");
  const [level, setLevel] = useState(employee?.level ?? "");
  const [position, setPosition] = useState(employee?.position ?? "");
  const [equipment, setEquipment] = useState(employee?.equipment ?? "");
  const [favouriteBrand, setFavouriteBrand] = useState(employee?.favouriteBrand ?? "");
  const [favouriteBrandInput, setFavouriteBrandInput] = useState(``);
  const [allEquipments, setAllEquipments] = useState(``);
  const [allBrands, setAllBrands] = useState(``);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/api/equipments`);
        const data = await response.json();
        if (response.ok) {
          setAllEquipments(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/api/brands`);
        const data = await response.json();
        if (response.ok) {
          setAllBrands(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

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

  const onSubmit = (e) => {
    e.preventDefault();

    if (employee) {
      return onSave({
        ...employee,
        name,
        level,
        position,
        equipment,
        favouriteBrand
      });
    }

    return onSave({
      name,
      level,
      position,
      equipment,
      favouriteBrand
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
