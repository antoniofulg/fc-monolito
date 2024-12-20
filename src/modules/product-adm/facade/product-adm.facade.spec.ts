import { Sequelize } from "sequelize-typescript"
import ProductModel from "../repository/product.model"
import AddProductUseCase from "../usecase/add-product/add-product.usecase"
import ProductRepository from "../repository/product.repository"
import ProductAdmFacade from "./product-adm.facade"
import ProductAdmFacadeFactory from "../factory/facade.factory"

describe("ProductAdmFacade", () => {
	let sequelize: Sequelize

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: "sqlite",
			storage: ":memory:",
			logging: false,
			sync: { force: true },
		})

		sequelize.addModels([ProductModel])
		await sequelize.sync()
	})

	afterEach(async () => {
		await sequelize.close()
	})

	it("should create a product", async () => {
		const productFacade = ProductAdmFacadeFactory.create()

		const input = {
			id: "1",
			name: "Product 1",
			description: "Product 1 description",
			purchasedPrice: 10,
			stock: 10,
		}

		await productFacade.addProduct(input)

		const product = await ProductModel.findOne({ where: { id: input.id } })
		expect(product).not.toBeNull()
		expect(product?.name).toBe(input.name)
		expect(product?.description).toBe(input.description)
		expect(product?.purchasedPrice).toBe(input.purchasedPrice)
		expect(product?.stock).toBe(input.stock)
	})
})
