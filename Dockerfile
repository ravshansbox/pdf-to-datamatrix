FROM node:lts as build
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM ubuntu
WORKDIR /app
RUN ln -fs /usr/share/zoneinfo/Asia/Tashkent /etc/localtime
RUN apt update && apt upgrade -y 
RUN apt install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - 
RUN apt install -y nodejs
RUN apt install -y dmtx-utils
RUN sed -i 's#<!-- <policy domain="module" rights="none" pattern="{PS,PDF,XPS}" /> -->#<policy domain="module" rights="read" pattern="{PS,PDF,XPS}" />#' /etc/ImageMagick-6/policy.xml
RUN sed -i 's#<policy domain="coder" rights="none" pattern="PDF" />#<policy domain="coder" rights="read" pattern="PDF" />#' /etc/ImageMagick-6/policy.xml
COPY --from=build dist/index.js ./
CMD node index.js
