const { buildSchema } = require("graphql");
const Grocery = require("../models/Grocery");

const schema = buildSchema(`
  type Query {
    getAllGroceries: [Grocery]
    getGroceryById(id: Int!): Grocery
    updateGrocery(id: Int!, name: String!, description: String!): Grocery
  }

  type Mutation {
    updateGrocery(id: Int!, name: String!, description: String!): Grocery
    createGrocery(name: String!, description: String!): Grocery
    deleteGrocery(id: Int!): Grocery
  }

  type Grocery {
    id: Int!,
    name: String!,
    description: String!
  }
`);

const root = {
  getAllGroceries: async () => {
    try {
      const groceries = await Grocery.find().lean();
      return groceries.map((grocery) => ({
        id: parseInt(grocery.id),
        name: grocery.name,
        description: grocery.description,
      }));
    } catch (err) {
      console.error(err);
      throw new Error("Error getting groceries");
    }
  },

  getGroceryById: ({ id }) => {
    return groceries.find((grocery) => grocery.id === id);
  },

  updateGrocery: ({ id, name, description }) => {
    const grocery = groceries.find((grocery) => grocery.id === id);
    if (!grocery) {
      throw new Error(`Grocery with id ${id} not found`);
    }
    grocery.name = name ?? grocery.name;
    grocery.description = description ?? grocery.description;
    return grocery;
  },

  createGrocery: async ({ name, description }) => {
    const existingGrocery = await Grocery.findOne({ name });
    if (existingGrocery) {
      throw new Error(`Grocery with name '${name}' already exists`);
    }

    const grocery = new Grocery({ name, description });
    try {
      const newGrocery = await grocery.save();
      return {
        id: newGrocery.id,
        name: newGrocery.name,
        description: newGrocery.description,
      };
    } catch (err) {
      console.error(err);
      throw new Error("Something went wrong");
    }
  },

  deleteGrocery: ({ id }) => {
    const index = groceries.findIndex((grocery) => grocery.id === id);

    if (index >= 0) {
      const deletedGrocery = groceries.splice(index, 1)[0];
      return deletedGrocery;
    } else {
      throw new Error(`Grocery with id ${id} not found`);
    }
  },
};

module.exports = { schema, root };
