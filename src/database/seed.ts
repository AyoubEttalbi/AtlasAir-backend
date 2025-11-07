import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Airline } from '../airlines/entities/airline.entity';
import { Airport } from '../airports/entities/airport.entity';
import { Flight } from '../flights/entities/flight.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Payment } from '../payments/entities/payment.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { getDatabaseConfig } from '../config/database.config';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function seed() {
  // Create config service
  const configService = new ConfigService();
  const dbConfig = getDatabaseConfig(configService);

  if (!dbConfig) {
    console.error('❌ Database configuration not found. Please check your .env file.');
    process.exit(1);
  }

  // Create data source - include all entities for proper relationship resolution
  const dataSource = new DataSource({
    ...dbConfig,
    entities: [User, Airline, Airport, Flight, Reservation, Payment],
  } as any);

  try {
    await dataSource.initialize();
    console.log('✅ Connected to database');

    const userRepository = dataSource.getRepository(User);
    const airlineRepository = dataSource.getRepository(Airline);
    const airportRepository = dataSource.getRepository(Airport);

    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@atlasair.com' },
    });

    if (!existingAdmin) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = userRepository.create({
        email: 'admin@atlasair.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        isActive: true,
      });
      await userRepository.save(admin);
      console.log('✅ Created admin user: admin@atlasair.com / admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Seed Airlines
    const airlines = [
      { name: 'Royal Air Maroc', code: 'AT', country: 'Morocco' },
      { name: 'Air France', code: 'AF', country: 'France' },
      { name: 'Emirates', code: 'EK', country: 'UAE' },
      { name: 'Lufthansa', code: 'LH', country: 'Germany' },
      { name: 'British Airways', code: 'BA', country: 'United Kingdom' },
      { name: 'Qatar Airways', code: 'QR', country: 'Qatar' },
      { name: 'Turkish Airlines', code: 'TK', country: 'Turkey' },
      { name: 'Air Arabia', code: 'G9', country: 'UAE' },
    ];

    for (const airlineData of airlines) {
      const existing = await airlineRepository.findOne({
        where: { code: airlineData.code },
      });
      if (!existing) {
        const airline = airlineRepository.create(airlineData);
        await airlineRepository.save(airline);
        console.log(`✅ Created airline: ${airlineData.name} (${airlineData.code})`);
      }
    }

    // Seed Airports
    const airports = [
      { name: 'Mohammed V International Airport', code: 'CMN', city: 'Casablanca', country: 'Morocco', latitude: 33.3675, longitude: -7.5898 },
      { name: 'Marrakech Menara Airport', code: 'RAK', city: 'Marrakech', country: 'Morocco', latitude: 31.6069, longitude: -8.0363 },
      { name: 'Paris Charles de Gaulle Airport', code: 'CDG', city: 'Paris', country: 'France', latitude: 49.0097, longitude: 2.5479 },
      { name: 'London Heathrow Airport', code: 'LHR', city: 'London', country: 'United Kingdom', latitude: 51.4700, longitude: -0.4543 },
      { name: 'Dubai International Airport', code: 'DXB', city: 'Dubai', country: 'UAE', latitude: 25.2532, longitude: 55.3657 },
      { name: 'Istanbul Airport', code: 'IST', city: 'Istanbul', country: 'Turkey', latitude: 41.2753, longitude: 28.7519 },
      { name: 'Frankfurt Airport', code: 'FRA', city: 'Frankfurt', country: 'Germany', latitude: 50.0379, longitude: 8.5622 },
      { name: 'Doha Hamad International Airport', code: 'DOH', city: 'Doha', country: 'Qatar', latitude: 25.2611, longitude: 51.5651 },
      { name: 'New York John F. Kennedy International Airport', code: 'JFK', city: 'New York', country: 'USA', latitude: 40.6413, longitude: -73.7781 },
      { name: 'Cairo International Airport', code: 'CAI', city: 'Cairo', country: 'Egypt', latitude: 30.1127, longitude: 31.4000 },
    ];

    for (const airportData of airports) {
      const existing = await airportRepository.findOne({
        where: { code: airportData.code },
      });
      if (!existing) {
        const airport = airportRepository.create(airportData);
        await airportRepository.save(airport);
        console.log(`✅ Created airport: ${airportData.name} (${airportData.code})`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   - Admin user: admin@atlasair.com / admin123');
    console.log('   - Airlines: 8 airlines created');
    console.log('   - Airports: 10 airports created');
    console.log('\n💡 You can now:');
    console.log('   1. Login with admin credentials to access admin features');
    console.log('   2. Register new users via POST /api/v1/auth/register');
    console.log('   3. Create flights using the airlines and airports');
    console.log('   4. Start making reservations!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

seed()
  .then(() => {
    console.log('\n✅ Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seed script failed:', error);
    process.exit(1);
  });

