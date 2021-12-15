import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => {
	return {
		uri: "mongodb+srv://test:izO9djIthUXyjtGj@cluster0.kmkgv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		// getMongoString(configService),
		...getMongoOptions()
	}
}

// const getMongoString = (configService: ConfigService) =>
// 	'mongodb' +
// 	configService.get('MONGO_LOGIN') +
// 	':' +
// 	configService.get('MONGO_PASSWORD') +
// 	'@' +
// 	configService.get('MONGO_HOST') +
// 	':' +
// 	configService.get('MONGO_PORT') +
// 	'/' +
// 	configService.get('MONGO_AUTHDATABASE')

// // mongodb+srv://test:<password>@cluster0.kmkgv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const getMongoOptions = () => ({
	useNewUrlParser: true,
	useUnifiedTopology: true
});