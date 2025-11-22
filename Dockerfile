# Stage 1: Build
FROM node:18-alpine AS builder

# Install required dependencies for Oracle Instant Client
RUN apk add --no-cache libaio libnsl libc6-compat curl unzip

# Download and install Oracle Instant Client
WORKDIR /opt/oracle
RUN curl -o instantclient-basiclite.zip https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip && \
    unzip instantclient-basiclite.zip && \
    rm -f instantclient-basiclite.zip && \
    cd /opt/oracle/instantclient* && \
    rm -f *jdbc* *occi* *mysql* *README *jar uidrvci genezi adrci && \
    mkdir -p /etc/ld.so.conf.d && \
    echo /opt/oracle/instantclient* > /etc/ld.so.conf.d/oracle-instantclient.conf

# Set Oracle environment variables
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient*:$LD_LIBRARY_PATH

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Install runtime dependencies for Oracle
RUN apk add --no-cache libaio libnsl libc6-compat

# Copy Oracle Instant Client from builder
COPY --from=builder /opt/oracle /opt/oracle

# Set Oracle environment variables
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient*:$LD_LIBRARY_PATH

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy uploads directory structure
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
