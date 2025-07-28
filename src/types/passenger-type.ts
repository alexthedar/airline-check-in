export type Passenger = {
  id: number;
  last_name: string;
  confirmation_number: string;
  flight_info: {
    flight_number: string;
    destination: string;
  };
  check_in_status: string;
  document_url: string | null;
};
