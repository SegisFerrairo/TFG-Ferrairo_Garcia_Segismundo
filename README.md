<!-- MultiLingQuiz is part of Segimundo Ferrairó García.

Segimundo Ferrairó García is free software: you can redistribute it and/or modify it under the terms 
of the GNU General Public License as published by the Free Software Foundation, 
either version 3 of the License, or (at your option) any later version.

Segimundo Ferrairó García is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Segimundo Ferrairó García. 
If not, see <https://www.gnu.org/licenses/>. -->

# TFG-Ferrairo_Garcia_Segismundo

## Licencia

Este proyecto está licenciado bajo los términos de la Licencia Pública General de GNU v3. Consulta el archivo `LICENSE` para más detalles.

## Documentación y Anexos
Google Drive: <https://drive.google.com/drive/folders/1OdA3-wrL49pMmlaggMY8vDwNJQCK5Wjz?usp=drive_link>

## Despliegue Docker


Asegurarse en primer lugar de navegar al directorio raíz del proyecto.
```bash
$ cd TFG-Ferrairo_Garcia_Segismundo
```	

Para construir y desplegar la aplicación:
```bash
$ docker-compose up --build
```

Para borrar la aplicación después de deternerla mediante Ctrl+C en la terminal activa:
```bash
$ docker-compose down -v --rmi all
```