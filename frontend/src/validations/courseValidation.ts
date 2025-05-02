import * as Yup from 'yup';

export const courseValidationSchema = Yup.object({
    code: Yup.string()
        .required('Ders kodu zorunludur')
        .matches(/^[A-Z]{3}[0-9]{3}$/, 'Ders kodu formatı: ABC123 şeklinde olmalıdır'),
    name: Yup.string()
        .required('Ders adı zorunludur')
        .min(3, 'Ders adı en az 3 karakter olmalıdır')
        .max(100, 'Ders adı en fazla 100 karakter olabilir'),
    description: Yup.string()
        .required('Ders açıklaması zorunludur')
        .min(10, 'Ders açıklaması en az 10 karakter olmalıdır')
        .max(500, 'Ders açıklaması en fazla 500 karakter olabilir'),
    credits: Yup.number()
        .required('Kredi sayısı zorunludur')
        .min(1, 'Kredi en az 1 olmalıdır')
        .max(30, 'Kredi en fazla 30 olabilir'),
    department: Yup.string()
        .required('Bölüm adı zorunludur')
        .min(3, 'Bölüm adı en az 3 karakter olmalıdır'),
    semester: Yup.string()
        .required('Dönem seçimi zorunludur'),
    instructor: Yup.string()
        .required('Öğretim görevlisi adı zorunludur')
        .min(3, 'Öğretim görevlisi adı en az 3 karakter olmalıdır'),
    capacity: Yup.number()
        .required('Kontenjan sayısı zorunludur')
        .min(1, 'Kontenjan en az 1 olmalıdır')
        .max(200, 'Kontenjan en fazla 200 olabilir')
}); 