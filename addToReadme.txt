to start backend, cd backend; npm start
to start frontend, cd frontend; npm start
got create newly seeded db in development,
  cd backend
  rm db/dev.db
  nds db:migrate
  nds db:seed:all
