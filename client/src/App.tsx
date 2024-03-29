import React, { useEffect, useState } from "react";
import "./App.css";

type TFlavorData = {
  id?: number;
  name: string;
  is_favorite?: boolean;
};

function App() {
  const [flavors, setFlavors] = useState<TFlavorData[]>([]);
  const [newFlavor, setNewFlavor] = useState<TFlavorData>({
    name: "",
  });

  useEffect(() => {
    const getFlavorsData = async () => {
      try {
        const response = await fetch("/api/flavors");
        const json = await response.json();
        setFlavors(json.data);
      } catch (error) {
        console.error(error);
      }
    };
    getFlavorsData();
  }, []);

  const deleteFlavor = async (singleFlavor: TFlavorData) => {
    try {
      await fetch(`/api/flavors/${singleFlavor.id}`, {
        method: "DELETE",
      });
      setFlavors(flavors.filter((_flavor) => _flavor.id !== singleFlavor.id));
    } catch (error) {
      console.error(error);
    }
  };

  const createFlavor = async (singleFlavor: TFlavorData) => {
    try {
      const response = await fetch(`/api/flavors`, {
        method: "POST",
        body: JSON.stringify(singleFlavor),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      setFlavors([...flavors, json]);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event?.preventDefault();
    if (newFlavor) await createFlavor(newFlavor);
  };

  const updateFlavor = async (singleFlavor: TFlavorData, boolear: boolean) => {
    singleFlavor.is_favorite = boolear;
    try {
      const response = await fetch(`/api/flavors/${singleFlavor.id}`, {
        method: "PUT",
        body: JSON.stringify(singleFlavor),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      setFlavors((currentFlavors) => {
        const updatedFlavors = currentFlavors.filter(
          (_flavor) => _flavor.id !== singleFlavor.id
        );
        return [...updatedFlavors, json];
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Hello Flavors {flavors.length}</h1>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(event) => {
            let newName = "";
            if (event.target.value) newName = event.target.value;
            setNewFlavor({ ...newFlavor, name: newName });
          }}
          placeholder="new flavor name"
          value={newFlavor.name}
        />
        <button type="submit">Add Flavor</button>
      </form>
      <ul>
        {flavors.map((flavor) => {
          return (
            <li key={flavor.id}>
              {flavor.name}
              <p>favorite flavor: {!flavor.is_favorite ? "false" : "true"}</p>
              <button
                className="border-solid p-1 hover:bg-indigo-800"
                onClick={() => deleteFlavor(flavor)}
              >
                delete flavor
              </button>
              {flavor.is_favorite ? (
                <>
                  <button
                    className="border-solid p-1 hover:bg-indigo-800"
                    onClick={() => updateFlavor(flavor, false)}
                  >
                    unfavorite?
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="border-solid p-1 hover:bg-indigo-800"
                    onClick={() => updateFlavor(flavor, true)}
                  >
                    favorite?
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
